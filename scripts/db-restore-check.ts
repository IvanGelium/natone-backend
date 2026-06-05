import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

function logStep(message: string): void {
  console.log(`\n[db-restore] ${message}`)
}

function logInfo(message: string): void {
  console.log(`[db-restore] ${message}`)
}

function logWarn(message: string): void {
  console.warn(`[db-restore][warn] ${message}`)
}

function fail(message: string, error?: unknown): never {
  console.error(`\n[db-restore][error] ${message}`)
  if (error) {
    if (error instanceof Error)
      console.error(error.message)
    else
      console.error(String(error))
  }
  process.exit(1)
}

interface RunOptions {
  allowFailure?: boolean
  captureStdout?: boolean
}

interface RunResult {
  stdout: string
  stderr: string
}

function run(command: string, args: string[], options: RunOptions = {}): Promise<RunResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ['pipe', 'pipe', 'pipe'] })

    let stdout = ''
    let stderr = ''

    child.stdout.on('data', (chunk) => {
      const text = chunk.toString()
      if (!options.captureStdout)
        process.stdout.write(text)
      stdout += text
    })

    child.stderr.on('data', (chunk) => {
      const text = chunk.toString()
      process.stderr.write(text)
      stderr += text
    })

    child.on('error', error => reject(error))

    child.on('close', (code) => {
      if (code === 0 || options.allowFailure)
        resolve({ stdout, stderr })
      else
        reject(new Error(`Command failed (${code}): ${command} ${args.join(' ')}`))
    })
  })
}

function parseArgs(argv: string[]): { backupPath: string, force: boolean, restoreMode: boolean } {
  const positional: string[] = []
  let force = false
  let restoreMode = false

  for (const arg of argv) {
    if (arg === '--force') {
      force = true
      continue
    }

    if (arg === '--restore') {
      restoreMode = true
      continue
    }

    if (arg.startsWith('-'))
      fail(`Unknown option: ${arg}`)

    positional.push(arg)
  }

  if (positional.length === 0)
    fail('Backup path is required. Usage: npm run db:check -- <path.sql.gz> OR npm run db:restore -- <path.sql.gz> --force')

  if (positional.length > 1)
    fail('Only one backup path is supported')

  return {
    backupPath: positional[0],
    force,
    restoreMode,
  }
}

function ensureReadableFile(rawPath: string): string {
  const resolvedPath = path.resolve(rawPath)

  if (!fs.existsSync(resolvedPath))
    fail(`Backup file does not exist: ${resolvedPath}`)

  try {
    fs.accessSync(resolvedPath, fs.constants.R_OK)
  }
  catch {
    fail(`Backup file is not readable: ${resolvedPath}`)
  }

  if (!resolvedPath.endsWith('.sql.gz'))
    logWarn(`File does not end with .sql.gz: ${resolvedPath}`)

  const stats = fs.statSync(resolvedPath)
  if (stats.size === 0)
    fail(`Backup file is empty: ${resolvedPath}`)

  logInfo(`Backup file: ${resolvedPath}`)
  logInfo(`Backup size: ${stats.size} bytes`)

  return resolvedPath
}

async function checkGzip(backupPath: string): Promise<void> {
  logStep('Checking gzip integrity')
  await run('gzip', ['-t', backupPath])
  logInfo('gzip integrity check passed')
}

async function previewSql(backupPath: string): Promise<void> {
  logStep('Checking SQL dump markers')

  const head = await run('sh', ['-c', `gunzip -c "${backupPath}" | head -n 80`], { captureStdout: true })
  const tail = await run('sh', ['-c', `gunzip -c "${backupPath}" | tail -n 80`], { captureStdout: true })

  const fullPreview = `${head.stdout}\n${tail.stdout}`

  if (!fullPreview.includes('PostgreSQL database dump'))
    fail('SQL preflight failed: header "PostgreSQL database dump" not found')

  if (!fullPreview.includes('PostgreSQL database dump complete'))
    fail('SQL preflight failed: completion marker "PostgreSQL database dump complete" not found')

  logInfo('SQL dump markers are valid')
}

interface DbTarget {
  host: string
  port: string
  username: string
  database: string
  originUrl: string
}

function loadDbTarget(): DbTarget {
  const cwd = process.cwd()
  const envPath = path.join(cwd, '.env')
  dotenv.config({ path: envPath })

  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl)
    fail('DATABASE_URL is missing in environment/.env')

  let parsed: URL
  try {
    parsed = new URL(dbUrl)
  }
  catch {
    fail('DATABASE_URL is invalid')
  }

  const protocol = parsed.protocol.replace(':', '')
  if (!['postgres', 'postgresql'].includes(protocol))
    fail(`DATABASE_URL must be postgres/postgresql, got: ${protocol}`)

  const database = parsed.pathname.replace(/^\//, '').split('?')[0]
  if (!database)
    fail('DATABASE_URL must contain database name')

  return {
    host: parsed.hostname || 'localhost',
    port: parsed.port || '5432',
    username: decodeURIComponent(parsed.username || ''),
    database,
    originUrl: dbUrl,
  }
}

function buildAdminUrl(target: DbTarget): string {
  const parsed = new URL(target.originUrl)
  parsed.pathname = '/postgres'
  parsed.search = ''
  parsed.hash = ''
  return parsed.toString()
}

function buildTargetUrl(target: DbTarget): string {
  const parsed = new URL(target.originUrl)
  parsed.pathname = `/${target.database}`
  parsed.search = ''
  parsed.hash = ''
  return parsed.toString()
}

function assertSafeDbName(database: string): void {
  if (!/^[\w\-]+$/.test(database))
    fail(`Unsafe database name: ${database}`)
}

async function resetDatabase(target: DbTarget): Promise<void> {
  logStep('Resetting target database')
  assertSafeDbName(target.database)

  const adminUrl = buildAdminUrl(target)

  await run('psql', [
    adminUrl,
    '-v',
    'ON_ERROR_STOP=1',
    '-c',
    `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='${target.database}' AND pid <> pg_backend_pid();`,
    '-c',
    `DROP DATABASE IF EXISTS "${target.database}";`,
    '-c',
    `CREATE DATABASE "${target.database}" OWNER "${target.username || target.database}";`,
  ])

  logInfo(`Database ${target.database} recreated`)
}

async function restoreDump(backupPath: string, target: DbTarget): Promise<void> {
  logStep('Restoring SQL dump to target database')

  const targetUrl = buildTargetUrl(target)
  const command = [
    `gunzip -c "${backupPath}"`,
    `sed -e '/^\\\\restrict /d' -e '/^\\\\unrestrict /d' -e '/ OWNER TO postgres;/d'`,
    `psql "${targetUrl}" -v ON_ERROR_STOP=1`,
  ].join(' | ')

  await run('sh', ['-c', command])
  logInfo('Restore completed successfully')
}

async function smokeCheck(target: DbTarget): Promise<void> {
  logStep('Running post-restore smoke check')
  const targetUrl = buildTargetUrl(target)

  const tables = await run('psql', [
    targetUrl,
    '-At',
    '-c',
    'SELECT tablename FROM pg_tables WHERE schemaname=\'public\' ORDER BY tablename;',
  ], { captureStdout: true })

  const tableNames = tables.stdout
    .split('\n')
    .map(name => name.trim())
    .filter(Boolean)

  logInfo(`Public tables (${tableNames.length}): ${tableNames.join(', ') || '(none)'}`)

  if (tableNames.length === 0)
    fail('Smoke check failed: no tables found in public schema')
}

async function main(): Promise<void> {
  const { backupPath, force, restoreMode } = parseArgs(process.argv.slice(2))
  const resolvedBackup = ensureReadableFile(backupPath)

  await checkGzip(resolvedBackup)
  await previewSql(resolvedBackup)

  const target = loadDbTarget()
  logStep('Target DB configuration')
  logInfo(`Host: ${target.host}`)
  logInfo(`Port: ${target.port}`)
  logInfo(`Database: ${target.database}`)
  logInfo(`User: ${target.username || '(from URL without explicit username)'}`)

  if (!restoreMode) {
    logStep('Check-only mode complete')
    logInfo('Archive looks valid. No DB changes were made.')
    return
  }

  if (!force)
    fail('Restore mode requires explicit --force flag')

  await resetDatabase(target)
  await restoreDump(resolvedBackup, target)
  await smokeCheck(target)

  logStep('Done')
  logInfo('Database restore finished and smoke-check passed')
}

const isEntryFile = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])
if (isEntryFile) {
  main().catch(error => fail('Unexpected failure', error))
}

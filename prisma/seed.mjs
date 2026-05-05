import process from 'node:process'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { Pool } from 'pg'
import 'dotenv/config'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  await prisma.stage.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      title: 'Без этапа',
      chapters: {
        create: {
          id: 1,
          title: 'Общее',
        },
      },
    },
  })

  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'adminadmin'
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin'
  const hashedPassword = await bcrypt.hash(adminPassword, 10)

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Global Admin',
      password: hashedPassword,
      role: 'ADMIN',
      isActive: true,
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    await pool.end()
    process.exit(1)
  })

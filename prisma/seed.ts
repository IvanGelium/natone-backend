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
  // Используем upsert, чтобы не создавать дубли при повторном запуске
  // Он обновит, если найдет по уникальному полю, или создаст, если нет
  await prisma.stage.upsert({
    where: { id: 1 }, // Предположим, мы резервируем ID 1 под дефолт
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

  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'adminadmin' // Поменяй на свой

  const hashedPassword = await bcrypt.hash(adminPassword, 10)

  await prisma.user.upsert({
    where: { email: process.env.SEED_ADMIN_EMAIL || 'admin' },
    update: {}, // Если админ есть, ничего не меняем
    create: {
      email: process.env.SEED_ADMIN_EMAIL || 'admin' ,
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
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    await pool.end()
    process.exit(1)
  })

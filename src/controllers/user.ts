import type { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { prisma } from '@/lib/prisma'
import { processSelect } from '@/utils/utils'

export async function getUsers(req: Request, res: Response) {
  // let select
  // select = processSelect(fields)
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
    },
  })
  res.json(users)
}

export async function getUserById(req: Request, res: Response) {
  const { fields } = req.query
  const id = Number(req.params.id)
  let select
  if (typeof fields === 'string')
    select = processSelect(fields)

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select,
  })
  res.json({
    id: user?.id,
    name: user?.name,
    email: user?.email,
    role: user?.role,
    isActive: user?.isActive,
  })
}

export async function createUser(req: Request, res: Response) {
  const { password, ...userData } = req.body
  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { ...userData, password: hashedPassword },

  })
  res.json(user)
}

export async function editUser(req: Request, res: Response) {
  const data = req.body
  const id = Number(req.params.id)
  const user = await prisma.user.update({
    where: { id },
    data,

  })
  res.json(user)
}

export async function deleteUser(req: Request, res: Response) {
  const id = Number(req.params.id)
  const user = await prisma.user.update({
    where: { id },
    data: {
      isActive: false,
      deletedAt: new Date(),
    },
  })
  res.json(user)
}

export async function forceDeleteUser(req: Request, res: Response) {
  const id = Number(req.params.id)
  const user = await prisma.user.delete({
    where: { id },
  })
  res.json(user)
}

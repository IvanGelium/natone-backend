import type { Request, Response } from 'express'
import { prisma } from '@/lib/prisma'

export async function getMe(req: Request, res: Response) {
  const id = Number(req.user.userId)
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  })
  res.json({
    id: user?.id,
    name: user?.name,
    email: user?.email,
    role: user?.role,
    isActive: user?.isActive,
  })
}

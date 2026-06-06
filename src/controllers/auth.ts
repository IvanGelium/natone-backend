import type { Request, Response } from 'express'
import process from 'node:process'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

export async function login(req: Request, res: Response) {
  const { email, password } = req.body
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Неверный логин или пароль' })
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' })

  res.json({ token, user: { id: user.id, email: user.email } })
}

export async function key(req: Request, res: Response) {
  const { key } = req.body
  if (key === 'adminadmin') {
    res.json({ access: 'granted', trueKey: '20071998Leo!' })
  }
  else {
    res.json({ access: 'refused', trueKey: null })
  }
}

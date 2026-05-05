import type { NextFunction, Request, Response } from 'express'
import process from 'node:process'
import jwt from 'jsonwebtoken'

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  req.user = null
  if (req.url.startsWith('/auth')) {
    return next()
  }
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return next()
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    req.user = decoded
    return next()
  }
  catch {
    return next()
  }
}

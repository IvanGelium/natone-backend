import type { NextFunction } from 'express'
import process from 'node:process'
import jwt from 'jsonwebtoken'

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  req.user = null
  if (req.url.startsWith('/auth')) {
    return next()
  }
  const token = req.headers.authorization?.split(' ')[1]
  if (!token)
    res.json()

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    req.user = decoded
    next()
  }
  catch {
    res.json()
  }
}

import type { NextFunction, Request, Response } from 'express'
import { z } from 'zod'

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof z.ZodError) {
    return res.status(400).json({ error: 'Validation failed', details: z.treeifyError(err) })
  }

  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
}

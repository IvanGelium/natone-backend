import process from 'node:process'

import express, { type Request, type Response } from 'express'
import { postMiddleware } from '@/middleware/postprocessing'

import { preMiddleware } from '@/middleware/preprocessing'
import router from '@/routes/routes'
import 'dotenv/config'

const app = express()

app.use(...preMiddleware)

app.get('/health', (_req: Request, res: Response) => {
  res.json({ ok: true })
})

app.use('/', router)

app.use(...postMiddleware)

const port = process.env.PORT || 5001
app.listen(port, () => {
  console.warn(`Server listening on http://localhost:${port}`)
})

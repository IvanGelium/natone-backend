import { json } from 'express'
import helmet from 'helmet'
import { limiter } from '@/middleware/preprocessing/limitter'
helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    connectSrc: ["'self'", "http://localhost:3000"],
  }
})

export const preMiddleware = [
  // helmet(),
  limiter,
  json(),
]

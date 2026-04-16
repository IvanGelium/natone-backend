import { errorHandler } from '@/middleware/postprocessing/errorsHandler'

export const postMiddleware = [
  errorHandler,
]

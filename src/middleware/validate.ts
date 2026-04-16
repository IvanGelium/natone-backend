import type { NextFunction, Request, Response } from 'express'

export function validate(schema) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      })
      req.body = validated.body
      req.query = validated.query
      req.params = validated.params

      return next()
    }
    catch (error) {
      return next(error)
    }
  }
}

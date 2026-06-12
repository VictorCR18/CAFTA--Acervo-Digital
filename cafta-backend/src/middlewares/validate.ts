import type { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'
import { AppError } from '../utils/AppError'

type Target = 'body' | 'query' | 'params'

export function validate(schema: ZodSchema, target: Target = 'body') {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target])
    if (!result.success) {
      const msg = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ')
      return next(new AppError(msg, 400))
    }
    ;(req as unknown as Record<string, unknown>)[target] = result.data
    next()
  }
}
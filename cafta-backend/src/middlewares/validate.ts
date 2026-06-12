import type { Request, Response, NextFunction } from 'express'
import { ZodSchema, ZodError } from 'zod'
import { AppError } from '../utils/AppError'

type Target = 'body' | 'query' | 'params'

/**
 * Returns an Express middleware that validates req[target] against a Zod schema.
 * On failure, throws AppError(400) with a readable message.
 */
export function validate(schema: ZodSchema, target: Target = 'body') {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target])
    if (!result.success) {
      const msg = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ')
      return next(new AppError(msg, 400))
    }
    // Replace with parsed+coerced values
    ;(req as Record<string, unknown>)[target] = result.data
    next()
  }
}

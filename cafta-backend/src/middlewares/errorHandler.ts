import type { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/AppError'
import { env } from '../config/env'

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Multer file-size error
  if (err.message?.includes('File too large')) {
    res.status(413).json({ success: false, error: 'Arquivo muito grande.' })
    return
  }

  // Known operational errors (AppError)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ success: false, error: err.message })
    return
  }

  // Unknown errors — don't leak internals in production
  if (env.NODE_ENV !== 'production') {
    console.error('❌  Unhandled error:', err)
  }

  res.status(500).json({ success: false, error: 'Erro interno do servidor.' })
}

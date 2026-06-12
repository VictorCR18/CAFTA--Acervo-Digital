import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'

import { env } from './config/env'
import { errorHandler } from './middlewares/errorHandler'
import midiaRoutes from './routes/midia.routes'
import pesquisaRoutes from './routes/pesquisa.routes'

export function createApp() {
  const app = express()

  // ─── Security ───────────────────────────────────────────────────────────────
  app.use(helmet())
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  )

  // ─── Rate limiting ───────────────────────────────────────────────────────────
  app.use(
    rateLimit({
      windowMs: env.RATE_LIMIT_WINDOW_MINUTES * 60 * 1000,
      max: env.RATE_LIMIT_MAX,
      standardHeaders: true,
      legacyHeaders: false,
      message: { success: false, error: 'Muitas requisições. Tente novamente em breve.' },
    })
  )

  // ─── Parsing & logging ───────────────────────────────────────────────────────
  app.use(compression())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'))

  // Nota: arquivos de mídia são servidos diretamente pelo Cloudflare R2.
  // Não há rota /uploads aqui — as URLs públicas ficam no campo thumbnailPath
  // e são construídas a partir de R2_PUBLIC_URL + pathRelativo no controller.

  // ─── API Routes ──────────────────────────────────────────────────────────────
  app.use('/api/midias', midiaRoutes)
  app.use('/api/pesquisas', pesquisaRoutes)

  // ─── Health check ────────────────────────────────────────────────────────────
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
  })

  // ─── 404 ─────────────────────────────────────────────────────────────────────
  app.use((_req, res) => {
    res.status(404).json({ success: false, error: 'Rota não encontrada.' })
  })

  // ─── Global error handler ────────────────────────────────────────────────────
  app.use(errorHandler)

  return app
}

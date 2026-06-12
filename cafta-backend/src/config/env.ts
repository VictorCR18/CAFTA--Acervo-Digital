import { z } from 'zod'
import dotenv from 'dotenv'

dotenv.config()

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  DATABASE_URL: z.string().url({ message: 'DATABASE_URL deve ser uma URL válida de conexão Postgres' }),

  UPLOAD_MAX_MB: z.coerce.number().default(100),

  CORS_ORIGIN: z.string().default('http://localhost:3000'),

  RATE_LIMIT_WINDOW_MINUTES: z.coerce.number().default(15),
  RATE_LIMIT_MAX: z.coerce.number().default(100),

  // ─── Cloudflare R2 ────────────────────────────────────────────────────────
  R2_ACCOUNT_ID: z.string({ required_error: 'R2_ACCOUNT_ID é obrigatório' }),
  R2_ACCESS_KEY_ID: z.string({ required_error: 'R2_ACCESS_KEY_ID é obrigatório' }),
  R2_SECRET_ACCESS_KEY: z.string({ required_error: 'R2_SECRET_ACCESS_KEY é obrigatório' }),
  R2_BUCKET_NAME: z.string().default('cafta-acervo'),
  // URL pública do bucket (domínio próprio ou o r2.dev fornecido pelo Cloudflare)
  R2_PUBLIC_URL: z.string().url({ message: 'R2_PUBLIC_URL deve ser uma URL válida' }),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌  Variáveis de ambiente inválidas:')
  console.error(parsed.error.flatten().fieldErrors)
  process.exit(1)
}

export const env = parsed.data

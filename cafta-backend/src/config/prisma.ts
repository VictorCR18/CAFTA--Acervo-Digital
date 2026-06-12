import { PrismaClient } from '@prisma/client'
import { env } from './env'

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

/**
 * Singleton do PrismaClient.
 * Em desenvolvimento, reutiliza a instância entre hot-reloads do tsx
 * para não estourar o limite de conexões do Postgres.
 */
export const prisma: PrismaClient =
  globalThis.__prisma ??
  new PrismaClient({
    log: env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
  })

if (env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma
}

export async function checkConnection(): Promise<void> {
  await prisma.$queryRaw`SELECT 1`
  console.log('✅  PostgreSQL conectado via Prisma')
}

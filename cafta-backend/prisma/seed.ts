import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱  Inserindo dados de exemplo...')

  const senhaPadrao = 'cafta2026'
  const hashedPassword = await bcrypt.hash(senhaPadrao, 10)

  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
    },
  })

  console.log('✅  Seed concluído.')
}

main()
  .catch((e) => {
    console.error('❌  Erro no seed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
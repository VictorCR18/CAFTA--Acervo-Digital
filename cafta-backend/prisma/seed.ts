import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱  Inserindo dados de exemplo...')

  await prisma.pesquisa.createMany({
    skipDuplicates: true,
    data: [
      {
        titulo: 'Memórias da Ditadura: representações e silêncios no curso de História da UFC',
        autores: ['Ana Carla Sousa', 'João Pedro Lima'],
        ano: 2024,
        destaque: true,
      },
      {
        titulo: 'O movimento estudantil cearense nos anos 1970',
        autores: ['Mariana Feitosa'],
        ano: 2023,
        destaque: false,
      },
      {
        titulo: 'Território e resistência: povos indígenas no sertão nordestino',
        autores: ['Carlos Eduardo Neves', 'Paula Rodrigues'],
        ano: 2023,
        destaque: true,
      },
      {
        titulo: 'Abolicionismo em Fortaleza: a imprensa e o debate em torno de 1884',
        autores: ['Lucas Araújo'],
        ano: 2022,
        destaque: false,
      },
      {
        titulo: 'Ensino de história pública e patrimônio cultural no Ceará',
        autores: ['Fernanda Melo', 'Gustavo Pinheiro'],
        ano: 2022,
        destaque: false,
      },
    ],
  })

  console.log('✅  Seed concluído.')
}

main()
  .catch((e) => {
    console.error('❌  Erro no seed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

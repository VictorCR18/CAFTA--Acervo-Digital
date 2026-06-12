/**
 * scripts/migrate-to-r2.ts
 *
 * Script one-shot para migrar arquivos existentes do disco para o R2.
 * Execute ANTES do primeiro deploy da versão com R2.
 *
 * Uso:
 *   npx tsx scripts/migrate-to-r2.ts
 *
 * Pré-requisitos:
 *   - .env preenchido com as variáveis R2_*
 *   - Pasta ./uploads ainda presente com os arquivos originais
 *   - Bucket R2 criado e com acesso público ativo
 */

import fs from 'fs/promises'
import path from 'path'
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

dotenv.config()

const prisma = new PrismaClient()

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId:     process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

const BUCKET      = process.env.R2_BUCKET_NAME!
const PUBLIC_URL  = process.env.R2_PUBLIC_URL!
const UPLOAD_DIR  = process.env.OLD_UPLOAD_DIR ?? './uploads' // pasta legada em disco

async function uploadFile(localPath: string, key: string, contentType: string): Promise<string> {
  const buffer = await fs.readFile(localPath)
  await r2.send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: buffer, ContentType: contentType }))
  return `${PUBLIC_URL}/${key}`
}

async function main() {
  const midias = await prisma.midia.findMany()
  console.log(`📦  ${midias.length} registro(s) encontrado(s). Iniciando migração...\n`)

  let ok = 0, skip = 0, fail = 0

  for (const midia of midias) {
    const localFile = path.join(UPLOAD_DIR, midia.pathRelativo)

    // Pula registros que já parecem ser URLs do R2
    if (midia.pathRelativo.startsWith('http')) { skip++; continue }

    try {
      await fs.access(localFile)
    } catch {
      console.warn(`⚠️   Arquivo não encontrado no disco: ${localFile} — pulando`)
      fail++; continue
    }

    try {
      // Upload do arquivo original
      await uploadFile(localFile, midia.pathRelativo, midia.mimetype)

      // Upload da thumbnail se existir
      let newThumbPath: string | null = null
      if (midia.thumbnailPath) {
        const localThumb = path.join(UPLOAD_DIR, midia.thumbnailPath)
        try {
          await fs.access(localThumb)
          newThumbPath = await uploadFile(localThumb, midia.thumbnailPath, 'image/webp')
        } catch {
          console.warn(`  ⚠️  Thumbnail não encontrada: ${localThumb}`)
        }
      }

      // Atualiza thumbnailPath para URL pública se havia thumbnail
      if (newThumbPath) {
        await prisma.midia.update({ where: { id: midia.id }, data: { thumbnailPath: newThumbPath } })
      }

      console.log(`✅  ${midia.id} → R2/${midia.pathRelativo}`)
      ok++
    } catch (err) {
      console.error(`❌  Falha em ${midia.id}:`, err)
      fail++
    }
  }

  console.log(`\n─────────────────────────────────────`)
  console.log(`✅  OK: ${ok}  |  ⏭️  Pulados: ${skip}  |  ❌  Falhas: ${fail}`)
  console.log(`─────────────────────────────────────`)
  console.log(`\nMigração concluída. Você pode agora apagar a pasta ${UPLOAD_DIR} com segurança.`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

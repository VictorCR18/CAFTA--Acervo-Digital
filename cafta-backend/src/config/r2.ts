import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { env } from './env'

// ─── S3-compatible client apontando para o Cloudflare R2 ─────────────────────

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
})

/**
 * Faz upload de um Buffer para o R2 e retorna a URL pública permanente.
 *
 * @param key          Caminho dentro do bucket, ex: "imagens/uuid.webp"
 * @param body         Conteúdo do arquivo em Buffer
 * @param contentType  MIME type do arquivo
 * @returns            URL pública, ex: "https://acervo.cafta.ufc.br/imagens/uuid.webp"
 */
export async function uploadToR2(
  key: string,
  body: Buffer,
  contentType: string
): Promise<string> {
  await r2Client.send(
    new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  )
  return `${env.R2_PUBLIC_URL}/${key}`
}

/**
 * Remove um objeto do R2 pelo seu key.
 * Fire-and-forget — erros são logados mas não propagados.
 */
export async function deleteFromR2(key: string): Promise<void> {
  try {
    await r2Client.send(
      new DeleteObjectCommand({
        Bucket: env.R2_BUCKET_NAME,
        Key: key,
      })
    )
  } catch (err) {
    console.error(`⚠️  Falha ao deletar objeto R2 "${key}":`, err)
  }
}

/**
 * Extrai o key (caminho interno do bucket) a partir de uma URL pública.
 * Ex: "https://acervo.cafta.ufc.br/imagens/abc.webp" → "imagens/abc.webp"
 */
export function keyFromUrl(publicUrl: string): string {
  return publicUrl.replace(`${env.R2_PUBLIC_URL}/`, '')
}

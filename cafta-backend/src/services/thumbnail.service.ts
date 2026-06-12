import sharp from 'sharp'

const THUMB_WIDTH   = 400
const THUMB_HEIGHT  = 300
const THUMB_QUALITY = 75

/**
 * Gera uma thumbnail WebP a partir de um Buffer de imagem.
 *
 * Estratégia:
 *  - Recebe o buffer original em memória (vindo do multer memoryStorage)
 *  - Retorna um novo Buffer WebP comprimido — nenhum arquivo toca o disco
 *  - O buffer resultante é enviado diretamente para o R2
 *
 * @param inputBuffer  Buffer do arquivo de imagem original
 * @returns            Buffer WebP da thumbnail gerada
 */
export async function generateThumbnailBuffer(inputBuffer: Buffer): Promise<Buffer> {
  return sharp(inputBuffer)
    .resize(THUMB_WIDTH, THUMB_HEIGHT, {
      fit: 'cover',
      position: 'attention', // smart crop — mantém a área mais saliente
    })
    .webp({ quality: THUMB_QUALITY })
    .toBuffer()
}

/**
 * Remove metadados EXIF de uma imagem (privacidade + redução de tamanho).
 * Recebe e retorna Buffer — sem tocar o disco.
 *
 * @param inputBuffer  Buffer do arquivo de imagem
 * @returns            Buffer da imagem sem EXIF
 */
export async function stripExifBuffer(inputBuffer: Buffer): Promise<Buffer> {
  return sharp(inputBuffer)
    .withMetadata({ exif: {} })
    .toBuffer()
}

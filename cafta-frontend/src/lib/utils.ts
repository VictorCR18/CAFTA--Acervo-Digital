import type { AcervoTipo } from '@/types'

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

export function labelForTipo(tipo: AcervoTipo): string {
  const labels: Record<AcervoTipo, string> = {
    imagens: 'Galeria de Imagens',
    videos: 'Galeria de Vídeos',
    artigos: 'Documentos Acadêmicos',
  }
  return labels[tipo]
}

export function actionLabelForTipo(tipo: AcervoTipo): string {
  const labels: Record<AcervoTipo, string> = {
    imagens: 'Visualizar',
    videos: 'Assistir',
    artigos: 'Baixar',
  }
  return labels[tipo]
}

/**
 * Generates a unique filename with a timestamp prefix.
 */
export function generateFilename(originalName: string): string {
  const ext = originalName.split('.').pop() ?? ''
  return `${Date.now()}.${ext}`
}

/**
 * Checks whether a MIME type is allowed for a given category.
 */
export function isMimeAllowed(mime: string, tipo: AcervoTipo, allowedTypes: Record<AcervoTipo, readonly string[]>): boolean {
  return allowedTypes[tipo]?.includes(mime) ?? false
}

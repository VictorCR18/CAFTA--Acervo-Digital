import multer from 'multer'
import { env } from './env'
import type { MidiaTipo } from '../types'

/** MIME types aceitos por categoria */
export const ALLOWED_MIME: Record<MidiaTipo, string[]> = {
  imagens: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  videos:  ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'],
  artigos: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ],
}

// memoryStorage: arquivo fica em req.file.buffer — nunca toca o disco local.
// O buffer é enviado diretamente para o R2 no controller.
const storage = multer.memoryStorage()

const fileFilter: multer.Options['fileFilter'] = (req, file, cb) => {
  const tipo = (req.body?.tipo ?? '') as MidiaTipo
  const allowed = ALLOWED_MIME[tipo] ?? []

  if (!allowed.includes(file.mimetype)) {
    cb(new Error(`Tipo de arquivo "${file.mimetype}" não permitido para a categoria "${tipo}".`))
    return
  }
  cb(null, true)
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: env.UPLOAD_MAX_MB * 1024 * 1024,
  },
})

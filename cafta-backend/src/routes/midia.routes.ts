import { Router } from 'express'
import { z } from 'zod'
import { upload } from '../config/multer'
import { validate } from '../middlewares/validate'
import {
  uploadMidia,
  getMidias,
  getMidiaByIdHandler,
  deleteMidiaHandler,
} from '../controllers/midia.controller'

const router = Router()

// Validation schemas
const uploadBodySchema = z.object({
  titulo: z.string().min(3, 'Título deve ter ao menos 3 caracteres').max(200),
  tipo: z.enum(['imagens', 'videos', 'artigos']),
})

const listQuerySchema = z.object({
  tipo: z.enum(['imagens', 'videos', 'artigos']).optional(),
  status: z.enum(['ativo', 'inativo', 'processando']).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
})

const idParamSchema = z.object({
  id: z.string().uuid('ID inválido'),
})

// ─── Routes ───────────────────────────────────────────────────────────────────

/**
 * POST /api/midias
 * multipart/form-data: titulo, tipo, arquivo
 */
router.post(
  '/',
  upload.single('arquivo'),
  validate(uploadBodySchema, 'body'),
  uploadMidia
)

/** GET /api/midias?tipo=imagens&search=texto&page=1&limit=20 */
router.get('/', validate(listQuerySchema, 'query'), getMidias)

/** GET /api/midias/:id */
router.get('/:id', validate(idParamSchema, 'params'), getMidiaByIdHandler)

/** DELETE /api/midias/:id */
router.delete('/:id', validate(idParamSchema, 'params'), deleteMidiaHandler)

export default router

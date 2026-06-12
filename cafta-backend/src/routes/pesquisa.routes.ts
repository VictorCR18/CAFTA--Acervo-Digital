import { Router } from 'express'
import { z } from 'zod'
import { validate } from '../middlewares/validate'
import {
  createPesquisaHandler,
  getPesquisas,
  getPesquisaByIdHandler,
  updatePesquisaHandler,
  deletePesquisaHandler,
} from '../controllers/pesquisa.controller'

const router = Router()

// Validation schemas
const createSchema = z.object({
  titulo: z.string().min(3).max(300),
  autores: z.array(z.string().min(1)).min(1, 'Informe pelo menos um autor'),
  ano: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  link: z.string().url('Link inválido').optional().or(z.literal('')),
  destaque: z.boolean().optional(),
})

const updateSchema = createSchema.partial()

const listQuerySchema = z.object({
  search: z.string().optional(),
  ano: z.coerce.number().int().optional(),
  destaque: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
})

const idParamSchema = z.object({
  id: z.string().uuid('ID inválido'),
})

// ─── Routes ───────────────────────────────────────────────────────────────────

/** POST /api/pesquisas */
router.post('/', validate(createSchema), createPesquisaHandler)

/** GET /api/pesquisas?search=texto&ano=2024&destaque=true */
router.get('/', validate(listQuerySchema, 'query'), getPesquisas)

/** GET /api/pesquisas/:id */
router.get('/:id', validate(idParamSchema, 'params'), getPesquisaByIdHandler)

/** PATCH /api/pesquisas/:id */
router.patch('/:id', validate(idParamSchema, 'params'), validate(updateSchema), updatePesquisaHandler)

/** DELETE /api/pesquisas/:id */
router.delete('/:id', validate(idParamSchema, 'params'), deletePesquisaHandler)

export default router

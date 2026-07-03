import { Router } from "express";
import { z } from "zod";
import { upload } from "../config/multer";
import { validate } from "../middlewares/validate";
import {
  uploadMidia,
  getMidias,
  getMidiaByIdHandler,
  deleteMidiaHandler,
  updateMidiaStatusHandler,
  updateMidiaHandler,
} from "../controllers/midia.controller";

const router = Router();

// Validation schemas
const uploadBodySchema = z.object({
  titulo: z.string().min(3, "Título deve ter ao menos 3 caracteres").max(200),
  tipo: z.enum(["imagens", "videos", "artigos"]),
  // Novos campos descritivos
  description: z.string().optional(),
  categoryId: z.string().optional(),
  historicalPeriod: z.string().optional(),
  authorship: z.string().optional(),
  publicationDate: z.string().optional(),
});

const listQuerySchema = z.object({
  tipo: z.enum(["imagens", "videos", "artigos"]).optional(),
  categoryId: z.string().optional(),
  status: z.enum(["ativo", "inativo", "processando"]).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

const idParamSchema = z.object({
  id: z.string().uuid("ID inválido"),
});

const updateStatusSchema = z.object({
  status: z.enum(["ativo", "inativo", "processando"]),
});

const updateMidiaSchema = z.object({
  titulo: z.string().min(3, "Título deve ter ao menos 3 caracteres").max(200).optional(),
  tipo: z.enum(["imagens", "videos", "artigos"]).optional(),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  historicalPeriod: z.string().optional(),
  authorship: z.string().optional(),
  publicationDate: z.string().optional(),
});

// ─── Routes ───────────────────────────────────────────────────────────────────

/**
 * POST /api/midias
 * multipart/form-data: titulo, tipo, arquivo
 */
router.post(
  "/",
  upload.single("arquivo"),
  validate(uploadBodySchema, "body"),
  uploadMidia,
);

/** GET /api/midias?tipo=imagens&search=texto&page=1&limit=20
 *
 * Note: For public display (e.g., homepage), this endpoint returns approved media items
 * when status='ativo' is specified (default when no status parameter provided).
 */
router.get("/", validate(listQuerySchema, "query"), getMidias);

/** GET /api/midias/:id */
router.get("/:id", validate(idParamSchema, "params"), getMidiaByIdHandler);

/** DELETE /api/midias/:id */
router.delete("/:id", validate(idParamSchema, "params"), deleteMidiaHandler);

/** PATCH /api/midias/:id/status
 * Update media status (aprovar/reprovar)
 */
router.patch(
  "/:id/status",
  upload.single("arquivo"),
  validate(idParamSchema, "params"),
  validate(updateStatusSchema, "body"),
  updateMidiaStatusHandler,
);

/** PATCH /api/midias/:id
 * Update media metadata
 */
router.patch(
  "/:id",
  validate(idParamSchema, "params"),
  validate(updateMidiaSchema, "body"),
  updateMidiaHandler,
);

export default router;

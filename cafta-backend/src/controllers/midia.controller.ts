import type { Request, Response } from "express";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { parsePagination } from "../utils/pagination";
import {
  generateThumbnailBuffer,
  stripExifBuffer,
} from "../services/thumbnail.service";
import { uploadToR2, deleteFromR2, keyFromUrl } from "../config/r2";
import {
  createMidia,
  listMidias,
  getMidiaById,
  updateMidiaStatus,
  updateMidiaThumbnail,
  deleteMidia,
} from "../models/midia.model";
import type { MidiaTipo, MidiaStatus } from "../types";

/** Extensão canônica por MIME */
const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/ogg": ".ogv",
  "video/quicktime": ".mov",
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    ".docx",
  "text/plain": ".txt",
};

// ─── POST /api/midias ─────────────────────────────────────────────────────────

export const uploadMidia = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw new AppError("Arquivo não enviado.", 400);

  const { titulo, tipo } = req.body as { titulo: string; tipo: MidiaTipo };
  const file = req.file;

  const ext = MIME_TO_EXT[file.mimetype] ?? path.extname(file.originalname);
  const filename = `${uuidv4()}${ext}`;
  const key = `${tipo}/${filename}`; // ex: "imagens/uuid.jpg"

  // Cria registro no banco com status "processando"
  const midia = await createMidia({
    titulo,
    tipo,
    filename,
    filenameOriginal: file.originalname,
    mimetype: file.mimetype,
    tamanhoBytes: BigInt(file.size),
    pathRelativo: key, // mantém semântica: caminho relativo dentro do R2
  });

  // Pós-processamento não-bloqueante — responde ao cliente primeiro
  setImmediate(async () => {
    try {
      let fileBuffer = file.buffer;

      if (tipo === "imagens") {
        // 1. Remove EXIF (privacidade + tamanho menor)
        fileBuffer = await stripExifBuffer(fileBuffer);

        // 2. Upload da imagem original (sem EXIF) para o R2
        await uploadToR2(key, fileBuffer, file.mimetype);

        // 3. Gera thumbnail WebP em memória e sobe para o R2
        const thumbBuffer = await generateThumbnailBuffer(fileBuffer);
        const thumbKey = `${tipo}/thumbs/${path.parse(filename).name}.webp`;
        const thumbnailUrl = await uploadToR2(
          thumbKey,
          thumbBuffer,
          "image/webp",
        );

        await updateMidiaThumbnail(midia.id, thumbnailUrl);
      } else {
        // Vídeos e artigos: upload direto para o R2
        await uploadToR2(key, fileBuffer, file.mimetype);
        await updateMidiaStatus(midia.id, "ativo");
      }
    } catch (err) {
      console.error(`❌  Falha no pós-processamento de ${midia.id}:`, err);
      await updateMidiaStatus(midia.id, "ativo"); // fallback: marca ativo de qualquer forma
    }
  });

  res.status(201).json({
    success: true,
    data: { ...midia, tamanhoBytes: midia.tamanhoBytes.toString() },
  });
});

// ─── GET /api/midias ──────────────────────────────────────────────────────────

export const getMidias = asyncHandler(async (req: Request, res: Response) => {
  const { tipo, status, search } = req.query as Record<string, string>;
  const { page, limit } = parsePagination(req.query as Record<string, string>);

  const { rows, total } = await listMidias({
    tipo: tipo as MidiaTipo | undefined,
    status: status as MidiaStatus | undefined,
    search,
    page,
    limit,
  });

  res.json({
    success: true,
    data: rows.map((m) => ({ ...m, tamanhoBytes: m.tamanhoBytes.toString() })),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
});

// ─── GET /api/midias/:id ──────────────────────────────────────────────────────

export const getMidiaByIdHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const midia = await getMidiaById(req.params.id);
    if (!midia) throw new AppError("Mídia não encontrada.", 404);

    res.json({
      success: true,
      data: { ...midia, tamanhoBytes: midia.tamanhoBytes.toString() },
    });
  },
);

// ─── DELETE /api/midias/:id ───────────────────────────────────────────────────

export const deleteMidiaHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const midia = await getMidiaById(req.params.id);
    if (!midia) throw new AppError("Mídia não encontrada.", 404);

    await deleteMidia(midia.id);

    // Remove do R2 (fire-and-forget — erros já são logados dentro de deleteFromR2)
    void deleteFromR2(midia.pathRelativo);
    if (midia.thumbnailPath) void deleteFromR2(keyFromUrl(midia.thumbnailPath));

    res.json({ success: true, message: "Mídia removida com sucesso." });
  },
);

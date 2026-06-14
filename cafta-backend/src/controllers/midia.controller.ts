import type { Request, Response } from "express";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { parsePagination } from "../utils/pagination";
import { createHash } from "crypto";
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
  updateMidia,
  getMidiaByHash,
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

  const {
    titulo,
    tipo,
    description,
    categoryId,
    historicalPeriod,
    authorship,
    publicationDate
  } = req.body as {
    titulo: string;
    tipo: MidiaTipo;
    description?: string | null;
    categoryId?: string | null;
    historicalPeriod?: string | null;
    authorship?: string | null;
    publicationDate?: string | null; // Date string from frontend
  };

  const file = req.file;

  // 1. Calcular hash SHA-256 do arquivo para detecção de duplicata
  const hashBuffer = createHash('sha256').update(file.buffer).digest();
  const hash = hashBuffer.toString('hex');

  // 2. Verificar se já existe uma mídia com este hash
  const existingMidia = await getMidiaByHash(hash);
  if (existingMidia) {
    // Arquivo duplicado detectado - retornar a mídia existente
    return res.status(200).json({
      success: true,
      data: { ...existingMidia, tamanhoBytes: existingMidia.tamanhoBytes.toString() },
      message: "Arquivo já existe no acervo. Retornando registro existente.",
    });
  }

  // 3. Se não for duplicado, prosseguir com o upload normal
  const ext = MIME_TO_EXT[file.mimetype] ?? path.extname(file.originalname);
  const filename = `${uuidv4()}${ext}`;
  const key = `${tipo}/${filename}`; // ex: "imagens/uuid.jpg"

  // Converte publicationDate de string para Date object se fornecido
  const pubDate = publicationDate ? new Date(publicationDate) : null;

  // Cria registro no banco com status "processando" e hash
  const midia = await createMidia({
    titulo,
    tipo,
    filename,
    filenameOriginal: file.originalname,
    mimetype: file.mimetype,
    tamanhoBytes: BigInt(file.size),
    pathRelativo: key, // mantém semântica: caminho relativo dentro do R2
    hash, // Armazena o hash para futura detecção de duplicatas
    // Novos campos descritivos
    description: description ?? null,
    categoryId: categoryId ?? null,
    historicalPeriod: historicalPeriod ?? null,
    authorship: authorship ?? null,
    publicationDate: pubDate,
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
        // NOTA: Mantém status como "processando" para passar pela aprovação
        // O status será atualizado manualmente pelo admin na página de moderação
      }
    } catch (err) {
      console.error(`❌  Falha no pós-processamento de ${midia.id}:`, err);
      // Em caso de erro, mantém como "processando" para tentar novamente posteriormente
      // ou pode ser marcado como "inativo" se preferir tratar como falha permanente
      // await updateMidiaStatus(midia.id, "processando"); // Já é o status atual
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

// ─── DELETE /api/midias/:id ─────────────────────────────────────────────────

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

// ─── PATCH /api/midias/:id/status ────────────────────────────────────────────

export const updateMidiaStatusHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body as { status: MidiaStatus };

    const midia = await updateMidiaStatus(id, status);
    if (!midia) throw new AppError("Mídia não encontrada.", 404);

    res.json({
      success: true,
      data: { ...midia, tamanhoBytes: midia.tamanhoBytes.toString() },
    });
  },
);

// ─── PATCH /api/midias/:id ────────────────────────────────────────────────

export const updateMidiaHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body as {
      titulo?: string;
      description?: string | null;
      categoryId?: string | null;
      historicalPeriod?: string | null;
      authorship?: string | null;
      publicationDate?: string | null; // Date string from frontend
    };

    // Converte publicationDate de string para Date object se fornecido
    const publicationDate = updates.publicationDate
      ? new Date(updates.publicationDate)
      : null;

    const midia = await updateMidia(id, {
      titulo: updates.titulo,
      description: updates.description ?? null,
      categoryId: updates.categoryId ?? null,
      historicalPeriod: updates.historicalPeriod ?? null,
      authorship: updates.authorship ?? null,
      publicationDate,
    });

    if (!midia) throw new AppError("Mídia não encontrada.", 404);

    res.json({
      success: true,
      data: { ...midia, tamanhoBytes: midia.tamanhoBytes.toString() },
    });
  },
);
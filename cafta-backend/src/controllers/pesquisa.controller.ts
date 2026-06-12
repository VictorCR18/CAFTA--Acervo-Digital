import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { parsePagination } from "../utils/pagination";
import {
  createPesquisa,
  listPesquisas,
  getPesquisaById,
  updatePesquisa,
  deletePesquisa,
} from "../models/pesquisa.model";
import type { CreatePesquisaBody, UpdatePesquisaBody } from "../types";

// ─── POST /api/pesquisas ──────────────────────────────────────────────────────

export const createPesquisaHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const body = req.body as CreatePesquisaBody;
    const pesquisa = await createPesquisa(body);
    res.status(201).json({ success: true, data: pesquisa });
  },
);

// ─── GET /api/pesquisas ───────────────────────────────────────────────────────

export const getPesquisas = asyncHandler(
  async (req: Request, res: Response) => {
    const { search, ano, destaque } = req.query as Record<string, string>;
    const { page, limit } = parsePagination(req.query as Record<string, string>);
    const { rows, total } = await listPesquisas({
      search,
      ano: ano ? parseInt(ano, 10) : undefined,
      destaque: destaque !== undefined ? destaque === "true" : undefined,
      page,
      limit,
    });

    res.json({
      success: true,
      data: rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  },
);

// ─── GET /api/pesquisas/:id ───────────────────────────────────────────────────

export const getPesquisaByIdHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const pesquisa = await getPesquisaById(req.params.id);
    if (!pesquisa) throw new AppError("Pesquisa não encontrada.", 404);
    res.json({ success: true, data: pesquisa });
  },
);

// ─── PATCH /api/pesquisas/:id ─────────────────────────────────────────────────

export const updatePesquisaHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const pesquisa = await updatePesquisa(
      req.params.id,
      req.body as UpdatePesquisaBody,
    );
    if (!pesquisa) throw new AppError("Pesquisa não encontrada.", 404);
    res.json({ success: true, data: pesquisa });
  },
);

// ─── DELETE /api/pesquisas/:id ────────────────────────────────────────────────

export const deletePesquisaHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const pesquisa = await deletePesquisa(req.params.id);
    if (!pesquisa) throw new AppError("Pesquisa não encontrada.", 404);
    res.json({ success: true, message: "Pesquisa removida com sucesso." });
  },
);

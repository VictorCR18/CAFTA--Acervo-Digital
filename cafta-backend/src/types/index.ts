import type { MidiaTipo, MidiaStatus, Midia, Pesquisa } from '@prisma/client'
import type { Request } from 'express'

// Re-export Prisma types so the rest of the app imports from one place
export type { MidiaTipo, MidiaStatus, Midia, Pesquisa }

// ─── API request bodies ───────────────────────────────────────────────────────

export interface UploadMidiaBody {
  titulo: string
  tipo: MidiaTipo
}

export interface CreatePesquisaBody {
  titulo: string
  autores: string[]
  ano: number
  link?: string
  destaque?: boolean
}

export type UpdatePesquisaBody = Partial<CreatePesquisaBody>

// ─── API response envelopes ───────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number
  page: number
  limit: number
  totalPages: number
}

// ─── Express typed request ────────────────────────────────────────────────────

export interface TypedRequest<B = unknown, Q = unknown, P = unknown>
  extends Request {
  body: B
  query: Q & Record<string, string | string[]>
  params: P & Record<string, string>
}

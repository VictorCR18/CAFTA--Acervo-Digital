import type { ReactNode } from 'react'

// ─── Acervo ──────────────────────────────────────────────────────────────

export type AcervoTipo = 'imagens' | 'videos' | 'artigos'

export interface ArquivoAcervo {
  thumbnailPath: string
  description: string
  categoryId: string
  historicalPeriod: string
  authorship: string
  publicationDate: string | number | Date
  id: string
  titulo: string
  tipo: AcervoTipo
  filename: string
  url: string
  thumbnailUrl?: string 
  dataUpload: string
  tamanho?: number
}

// ─── Pesquisa ─────────────────────────────────────────────────────────────

export interface Pesquisa {
  title: any
  id: string
  titulo: string
  autores: string[]
  ano: number
  link?: string
  destaque?: boolean
}

// ─── Acervo Category Card ────────────────────────────────────────────────

export interface CategoriaAcervo {
  slug: AcervoTipo | string
  titulo: string
  descricao: string
  imagemSrc: string
  imagemAlt: string
}

// ─── Upload ───────────────────────────────────────────────────────────────

export interface UploadResponse {
  message: string
  fileUrl: string
  filename: string
  tipo: AcervoTipo
}

export interface UploadError {
  error: string
}

// ─── Navigation ───────────────────────────────────────────────────────────

export interface NavItem {
  label: string
  href: string
  sectionId?: string
}

// ─── Acervo Item (for admin details view) ────────────────────────────────

export interface AcervoItem {
  id: string
  title: string
  description: string
  categoryId: string
  historicalPeriod: string
  authorship: string
  fileUrl: string
  publicationDate: string | Date
  tipo: AcervoTipo
}
import { Prisma } from '@prisma/client'
import { prisma } from '../config/prisma'
import type { Midia, MidiaTipo, MidiaStatus } from '../types'
import { parsePagination } from '../utils/pagination'

// ─── Input types ──────────────────────────────────────────────────────────────

export interface CreateMidiaInput {
  titulo: string
  tipo: MidiaTipo
  filename: string
  filenameOriginal: string
  mimetype: string
  tamanhoBytes: bigint
  pathRelativo: string
  thumbnailPath?: string | null
  hash?: string                         // Hash SHA-256 para detecção de duplicata
  // Novos campos para metadados descritivos
  description?: string | null
  categoryId?: string | null
  historicalPeriod?: string | null
  authorship?: string | null
  publicationDate?: Date | null
}

export interface ListMidiaFilters {
  tipo?: MidiaTipo
  status?: MidiaStatus
  search?: string
  page?: number
  limit?: number
}

export interface ListMidiaResult {
  rows: Midia[]
  total: number
}

// ─── Model functions ──────────────────────────────────────────────────────────

export async function createMidia(input: CreateMidiaInput): Promise<Midia> {
  return prisma.midia.create({
    data: {
      titulo: input.titulo,
      tipo: input.tipo,
      filename: input.filename,
      filenameOriginal: input.filenameOriginal,
      mimetype: input.mimetype,
      tamanhoBytes: input.tamanhoBytes,
      pathRelativo: input.pathRelativo,
      thumbnailPath: input.thumbnailPath ?? null,
      hash: input.hash ?? null,
      status: 'processando', // starts as processando, updated after thumbnail
      // Novos campos
      description: input.description ?? null,
      categoryId: input.categoryId ?? null,
      historicalPeriod: input.historicalPeriod ?? null,
      authorship: input.authorship ?? null,
      publicationDate: input.publicationDate ?? null,
    },
  })
}

export async function listMidias(filters: ListMidiaFilters = {}): Promise<ListMidiaResult> {
  const { page = 1, limit = 20 } = filters
  const { offset } = parsePagination({ page: String(page), limit: String(limit) })

  const where: Prisma.MidiaWhereInput = {
    status: filters.status ?? 'ativo',
    ...(filters.tipo && { tipo: filters.tipo }),
    ...(filters.search && {
      titulo: { contains: filters.search, mode: 'insensitive' },
    }),
  }

  const [rows, total] = await prisma.$transaction([
    prisma.midia.findMany({
      where,
      orderBy: { criadoEm: 'desc' },
      take: limit,
      skip: offset,
    }),
    prisma.midia.count({ where }),
  ])

  return { rows, total }
}

export async function getMidiaById(id: string): Promise<Midia | null> {
  return prisma.midia.findUnique({ where: { id } })
}

export async function updateMidiaStatus(id: string, status: MidiaStatus): Promise<Midia | null> {
  return prisma.midia.update({ where: { id }, data: { status } }).catch(() => null)
}

export async function updateMidiaThumbnail(id: string, thumbnailPath: string): Promise<void> {
  await prisma.midia.update({
    where: { id },
    data: { thumbnailPath },
  })
}

export async function updateMidia(
  id: string,
  data: Partial<{
    titulo: string
    description: string | null
    categoryId: string | null
    historicalPeriod: string | null
    authorship: string | null
    publicationDate: Date | null
  }>
): Promise<Midia | null> {
  return prisma.midia.update({
    where: { id },
    data,
  }).catch(() => null)
}

export async function deleteMidia(id: string): Promise<Midia | null> {
  return prisma.midia.delete({ where: { id } }).catch(() => null)
}

// Funções para atualizar os novos campos descritivos
export async function updateMidiaDescription(
  id: string,
  description: string | null
): Promise<Midia | null> {
  return prisma.midia.update({
    where: { id },
    data: { description },
  }).catch(() => null)
}

export async function updateMidiaCategory(
  id: string,
  categoryId: string | null
): Promise<Midia | null> {
  return prisma.midia.update({
    where: { id },
    data: { categoryId },
  }).catch(() => null)
}

export async function updateMidiaHistoricalPeriod(
  id: string,
  historicalPeriod: string | null
): Promise<Midia | null> {
  return prisma.midia.update({
    where: { id },
    data: { historicalPeriod },
  }).catch(() => null)
}

export async function updateMidiaAuthorship(
  id: string,
  authorship: string | null
): Promise<Midia | null> {
  return prisma.midia.update({
    where: { id },
    data: { authorship },
  }).catch(() => null)
}

export async function updateMidiaPublicationDate(
  id: string,
  publicationDate: Date | null
): Promise<Midia | null> {
  return prisma.midia.update({
    where: { id },
    data: { publicationDate },
  }).catch(() => null)
}

// Função para buscar mídia por hash (para detecção de duplicata)
export async function getMidiaByHash(hash: string): Promise<Midia | null> {
  return prisma.midia.findFirst({
    where: { hash },
  })
}
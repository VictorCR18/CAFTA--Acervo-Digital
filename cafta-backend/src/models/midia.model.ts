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
      status: 'processando', // starts as processando, updated after thumbnail
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
    data: { thumbnailPath, status: 'ativo' },
  })
}

export async function deleteMidia(id: string): Promise<Midia | null> {
  return prisma.midia.delete({ where: { id } }).catch(() => null)
}

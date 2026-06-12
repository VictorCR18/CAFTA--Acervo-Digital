import { Prisma } from '@prisma/client'
import { prisma } from '../config/prisma'
import type { Pesquisa, CreatePesquisaBody, UpdatePesquisaBody } from '../types'
import { parsePagination } from '../utils/pagination'

export interface ListPesquisaFilters {
  search?: string
  ano?: number
  destaque?: boolean
  page?: number
  limit?: number
}

export interface ListPesquisaResult {
  rows: Pesquisa[]
  total: number
}

export async function createPesquisa(input: CreatePesquisaBody): Promise<Pesquisa> {
  return prisma.pesquisa.create({
    data: {
      titulo: input.titulo,
      autores: input.autores,
      ano: input.ano,
      link: input.link ?? null,
      destaque: input.destaque ?? false,
    },
  })
}

export async function listPesquisas(filters: ListPesquisaFilters = {}): Promise<ListPesquisaResult> {
  const { page = 1, limit = 20 } = filters
  const { offset } = parsePagination({ page: String(page), limit: String(limit) })

  const where: Prisma.PesquisaWhereInput = {
    ...(filters.search && {
      titulo: { contains: filters.search, mode: 'insensitive' },
    }),
    ...(filters.ano && { ano: filters.ano }),
    ...(filters.destaque !== undefined && { destaque: filters.destaque }),
  }

  const [rows, total] = await prisma.$transaction([
    prisma.pesquisa.findMany({
      where,
      orderBy: [{ destaque: 'desc' }, { ano: 'desc' }],
      take: limit,
      skip: offset,
    }),
    prisma.pesquisa.count({ where }),
  ])

  return { rows, total }
}

export async function getPesquisaById(id: string): Promise<Pesquisa | null> {
  return prisma.pesquisa.findUnique({ where: { id } })
}

export async function updatePesquisa(id: string, input: UpdatePesquisaBody): Promise<Pesquisa | null> {
  return prisma.pesquisa
    .update({
      where: { id },
      data: {
        ...(input.titulo !== undefined && { titulo: input.titulo }),
        ...(input.autores !== undefined && { autores: input.autores }),
        ...(input.ano !== undefined && { ano: input.ano }),
        ...(input.link !== undefined && { link: input.link }),
        ...(input.destaque !== undefined && { destaque: input.destaque }),
      },
    })
    .catch(() => null)
}

export async function deletePesquisa(id: string): Promise<Pesquisa | null> {
  return prisma.pesquisa.delete({ where: { id } }).catch(() => null)
}

export interface PaginationParams {
  page: number
  limit: number
  offset: number
}

export function parsePagination(
  query: Record<string, string | string[] | undefined>,
  defaults = { page: 1, limit: 20 }
): PaginationParams {
  const page  = Math.max(1, parseInt(String(query.page  ?? defaults.page),  10) || defaults.page)
  const limit = Math.min(100, Math.max(1, parseInt(String(query.limit ?? defaults.limit), 10) || defaults.limit))
  return { page, limit, offset: (page - 1) * limit }
}

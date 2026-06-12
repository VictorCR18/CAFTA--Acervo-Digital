import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { cookies } from 'next/headers'
import type { AcervoTipo } from '@/types'

// Check if user is authenticated
async function authenticate(request: NextRequest): Promise<boolean> {
  const cookieStore = cookies()
  const token = cookieStore.get('admin-token')?.value
  return token === 'authenticated'
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Check authentication
    const isAuthenticated = await authenticate(request)
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const tipos: AcervoTipo[] = ['imagens', 'videos', 'artigos']
    let totalCount = 0

    // Count pending files for each tipo
    for (const tipo of tipos) {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', tipo, 'pending')

      try {
        const files = await fs.readdir(uploadDir)
        // Count non-hidden files
        const count = files.filter(file => !file.startsWith('.')).length
        totalCount += count
      } catch (err) {
        // Directory might not exist yet, that's OK - counts as 0
        if (err.code !== 'ENOENT') {
          console.error(`[admin/pending-count] Error reading ${tipo} directory:`, err)
        }
      }
    }

    return NextResponse.json({ count: totalCount })
  } catch (error) {
    console.error('[admin/pending-count] Error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { cookies } from 'next/headers'

// Check if user is authenticated
async function authenticate(request: NextRequest): Promise<boolean> {
  const cookieStore = cookies()
  const token = cookieStore.get('admin-token')?.value
  return token === 'authenticated'
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Skip authentication check in development for easier testing
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
      // Allow access in development
    } else {
      // Check authentication
      const isAuthenticated = await authenticate(request)
      if (!isAuthenticated) {
        return NextResponse.json(
          { error: 'Não autorizado' },
          { status: 401 }
        )
      }
    }

    const { filename, tipo } = await request.json()

    if (!filename || !tipo) {
      return NextResponse.json(
        { error: 'Nome do arquivo e tipo são obrigatórios' },
        { status: 400 }
      )
    }

    // Validate tipo
    const validTipos: string[] = ['imagens', 'videos', 'artigos']
    if (!validTipos.includes(tipo)) {
      return NextResponse.json(
        { error: 'Tipo de conteúdo inválido' },
        { status: 400 }
      )
    }

    const pendingDir = path.join(process.cwd(), 'public', 'uploads', tipo, 'pending')
    const pendingFilePath = path.join(pendingDir, filename)

    // Check if file exists in pending directory
    try {
      await fs.access(pendingFilePath)
    } catch {
      return NextResponse.json(
        { error: 'Arquivo não encontrado na fila de pendentes' },
        { status: 404 }
      )
    }

    // Delete file from pending directory
    await fs.unlink(pendingFilePath)

    return NextResponse.json({
      success: true,
      message: 'Arquivo rejeitado e removido com sucesso'
    })
  } catch (error) {
    console.error('[admin/reject] Error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
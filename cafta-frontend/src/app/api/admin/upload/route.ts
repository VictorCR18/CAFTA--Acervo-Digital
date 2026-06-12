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

    const tipos: AcervoTipo[] = ['imagens', 'videos', 'artigos']
    const pendingFiles: any[] = []

    // Fetch pending files for each tipo
    for (const tipo of tipos) {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', tipo, 'pending')

      try {
        const files = await fs.readdir(uploadDir)

        for (const filename of files) {
          if (filename.startsWith('.')) continue

          // Extract timestamp from filename (assuming format: timestamp.extension)
          const timestamp = filename.split('.')[0]
          const uploadDate = new Date(parseInt(timestamp))

          pendingFiles.push({
            id: filename,
            titulo: filename.replace(/^\d+-/, "").replace(/\.[^.]+$/, ""),
            tipo,
            filename,
            url: `/uploads/${tipo}/pending/${filename}`,
            dataUpload: uploadDate.toLocaleDateString("pt-BR"),
            uploadTimestamp: parseInt(timestamp)
          })
        }
      } catch (err: unknown) {
        // Directory might not exist yet, that's OK
        const errorCode =
          typeof err === 'object' && err !== null && 'code' in err
            ? (err as { code: unknown }).code
            : undefined

        if (errorCode !== 'ENOENT') {
          console.error(`[admin/upload] Error reading ${tipo} directory:`, err)
        }
      }
    }

    // Sort by upload timestamp (newest first)
    pendingFiles.sort((a, b) => b.uploadTimestamp - a.uploadTimestamp)

    return NextResponse.json({ files: pendingFiles })
  } catch (error) {
    console.error('[admin/upload] Error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
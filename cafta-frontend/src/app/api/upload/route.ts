import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { UPLOAD_ALLOWED_TYPES, UPLOAD_MAX_SIZE_MB } from '@/lib/constants'
import { generateFilename, isMimeAllowed } from '@/lib/utils'
import type { AcervoTipo, UploadResponse, UploadError } from '@/types'

export async function POST(request: NextRequest): Promise<NextResponse<UploadResponse | UploadError>> {
  try {
    const formData = await request.formData()
    const titulo = formData.get('titulo')
    const tipo = formData.get('tipo')
    const arquivo = formData.get('arquivo')

    // ── Basic validation ────────────────────────────────────────────
    if (!titulo || typeof titulo !== 'string' || titulo.trim() === '') {
      return NextResponse.json({ error: 'Título é obrigatório.' }, { status: 400 })
    }
    if (!tipo || typeof tipo !== 'string') {
      return NextResponse.json({ error: 'Tipo de conteúdo é obrigatório.' }, { status: 400 })
    }
    if (!arquivo || !(arquivo instanceof File)) {
      return NextResponse.json({ error: 'Arquivo é obrigatório.' }, { status: 400 })
    }

    const tipoKey = tipo as AcervoTipo
    if (!['imagens', 'videos', 'artigos'].includes(tipoKey)) {
      return NextResponse.json({ error: 'Tipo de conteúdo inválido.' }, { status: 400 })
    }

    // ── Size validation ────────────────────────────────────────────
    const maxBytes = UPLOAD_MAX_SIZE_MB * 1024 * 1024
    if (arquivo.size > maxBytes) {
      return NextResponse.json(
        { error: `O arquivo deve ter no máximo ${UPLOAD_MAX_SIZE_MB} MB.` },
        { status: 400 }
      )
    }

    // ── MIME type validation ────────────────────────────────────────
    if (!isMimeAllowed(arquivo.type, tipoKey, UPLOAD_ALLOWED_TYPES)) {
      return NextResponse.json(
        { error: `Tipo de arquivo não permitido para a categoria "${tipoKey}".` },
        { status: 400 }
      )
    }

    // ── Save file to pending directory ────────────────────────────────────────
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', tipoKey, 'pending')
    await fs.mkdir(uploadDir, { recursive: true })

    const filename = generateFilename(arquivo.name)
    const filePath = path.join(uploadDir, filename)

    const bytes = await arquivo.arrayBuffer()
    await fs.writeFile(filePath, new Uint8Array(bytes))

    const fileUrl = `/uploads/${tipoKey}/pending/${filename}`

    return NextResponse.json(
      {
        message: 'Arquivo enviado com sucesso!',
        fileUrl,
        filename,
        tipo: tipoKey,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[upload] Internal error:', error)
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 })
  }
}

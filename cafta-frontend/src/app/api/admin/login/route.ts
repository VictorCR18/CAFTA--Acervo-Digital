import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// In a real app, this would come from environment variables and be more secure
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'cafta2026'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { password } = await request.json()

    if (!password || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Senha inválida' },
        { status: 401 }
      )
    }

    // Create a session cookie (httpOnly for security)
    const response = NextResponse.json({ success: true })
    response.cookies.set('admin-token', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    })

    return response
  } catch (error) {
    console.error('[admin/login] Error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Optional: GET route to check auth status
export async function GET(request: NextRequest): Promise<NextResponse> {
  const cookieStore = cookies()
  const token = cookieStore.get('admin-token')?.value

  if (token === 'authenticated') {
    return NextResponse.json({ authenticated: true })
  }

  return NextResponse.json(
    { authenticated: false },
    { status: 401 }
  )
}
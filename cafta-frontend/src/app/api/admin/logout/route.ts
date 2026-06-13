import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const response = NextResponse.json({ success: true })
    response.cookies.set('admin-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0, // Expire immediately
      path: '/',
    })

    return response
  } catch (error) {
    console.error('[admin/logout] Error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
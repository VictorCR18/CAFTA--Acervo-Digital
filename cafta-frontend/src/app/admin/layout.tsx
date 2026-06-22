"use client"

import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import api from "@/lib/api"

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    if (pathname === '/admin/login') {
      setIsCheckingAuth(false)
      return
    }

    const checkAuth = async () => {
      try {
        await api.get('/api/admin/pending-count') // rota protegida — 401 se não autenticado
      } catch (err: any) {
        if (err.response?.status === 401) {
          router.replace('/admin/login')
        }
      } finally {
        setIsCheckingAuth(false)
      }
    }

    checkAuth()
  }, [router, pathname])

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-cafta-dark flex items-center justify-center py-12">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="5"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <span className="ml-2 text-white">Verificando acesso...</span>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
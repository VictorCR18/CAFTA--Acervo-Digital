"use client"

import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { api } from "@/lib/api";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    // Skip auth check for login page to prevent redirect loop
    if (pathname === '/admin/login') {
      setIsCheckingAuth(false)
      return
    }

    // Check if user is authenticated by calling the auth status API
    const checkAuth = async () => {
      try {
        const res = await api.get('/api/admin/login', {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        })

        if (!res.ok) {
          // Not authenticated, redirect to login
          router.replace('/admin/login')
        }
        // If authenticated, do nothing and let children render
      } catch (error) {
        console.error('[AdminLayout] Auth check error:', error)
        // On error, redirect to login to be safe
        router.replace('/admin/login')
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
          <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="5"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <span className="ml-2 text-white">Verificando acesso...</span>
        </div>
      </div>
    )
  }

  return (
    <>
      {children}
    </>
  )
}
'use client';

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { usePendingFiles } from '@/lib/usePendingFiles'
import { useAcervoItems } from '@/lib/useAcervoItems'
import { usePesquisas } from '@/lib/usePesquisas'
import api from "@/lib/api";

export default function AdminDashboard() {
  const { pendingFiles, loading: pendingLoading, error: pendingError } = usePendingFiles()
  const { data: acervoItems, loading: acervoLoading, error: acervoError } = useAcervoItems({ searchTerm: "" })
  const { data: pesquisas, loading: pesquisasLoading, error: pesquisasError } = usePesquisas()

  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const isLoading = pendingLoading || acervoLoading || pesquisasLoading
    const combinedError = pendingError || acervoError || pesquisasError
    setLoading(isLoading)
    setError(combinedError)
  }, [pendingLoading, acervoLoading, pesquisasLoading, pendingError, acervoError, pesquisasError])

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await api.post('/api/admin/logout', { credentials: 'include' })
    } catch (err) {
      console.error('[AdminDashboard] Logout error:', err)
    } finally {
      window.location.href = '/admin/login'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cafta-dark flex items-center justify-center py-12">
        <div className="text-center">
          <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="5"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <span className="ml-2 text-white">Carregando...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cafta-dark flex items-center justify-center py-12">
        <div className="text-center">
          <h2 className="text-white/50 text-sm mb-4">Erro</h2>
          <p className="text-red-400">{error}</p>
          <Link href="/admin/login" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cafta-gold hover:bg-cafta-gold-light">
            Tentar novamente
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cafta-dark">
      {/* Header */}
      <div className="bg-cafta-primary/50 border-b border-white/10">
        <div className="container mx-auto px-4 md:px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Painel Administrativo</h1>
              <p className="mt-1 text-sm text-white/60">
                Visão geral das ferramentas administrativas
              </p>
            </div>

            {/* Right side: voltar ao site + user dropdown */}
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-sm font-medium text-white hover:text-cafta-gold">
                Voltar ao site
              </Link>

              {/* User dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
                  aria-label="Menu do usuário"
                >
                  {/* User icon */}
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>

                {/* Dropdown menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-cafta-primary border border-white/10 rounded-lg shadow-lg z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-xs text-white/40">Logado como</p>
                      <p className="text-sm font-medium text-white truncate">Administrador</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/admin/configuracoes"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        {/* Settings icon */}
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Configurações
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-white/10 hover:text-red-300 transition-colors"
                      >
                        {/* Logout icon */}
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sair
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content — sem alterações */}
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Card 1: Aprovação de Mídia */}
          <Link href="/admin/moderacao" className="group relative overflow-hidden bg-cafta-dark/50 border border-white/10 rounded-lg hover:bg-cafta-dark/70 transition-colors cursor-pointer">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <svg className="h-8 w-8 text-cafta-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cafta-gold/20 text-cafta-gold">
                  {pendingFiles.length}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Aprovação de Mídia</h2>
              <p className="text-white/60 text-sm mb-4">Revise e aprove ou rejeite as submissões de mídia pendentes</p>
              <div className="mt-6 flex items-center space-x-3 text-sm text-white/60">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
                <span>Ver pendências</span>
              </div>
            </div>
          </Link>

          {/* Card 2: Gerenciamento do Acervo */}
          <Link href="/admin/acervo" className="group relative overflow-hidden bg-cafta-dark/50 border border-white/10 rounded-lg hover:bg-cafta-dark/70 transition-colors cursor-pointer">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <svg className="h-8 w-8 text-cafta-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9 20h10a2 2 0 002-2V8a2 2 0 00-2-2h-4l-3-3H7a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cafta-gold/20 text-cafta-gold">
                  {acervoItems.length}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Gerenciamento do Acervo</h2>
              <p className="text-white/60 text-sm mb-4">Visualize, edite e gerencie itens do acervo histórico</p>
              <div className="mt-6 flex items-center space-x-3 text-sm text-white/60">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
                <span>Acessar acervo</span>
              </div>
            </div>
          </Link>

          {/* Card 3: Gerenciamento de Pesquisas */}
          <Link href="/admin/pesquisas" className="group relative overflow-hidden bg-cafta-dark/50 border border-white/10 rounded-lg hover:bg-cafta-dark/70 transition-colors cursor-pointer">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <svg className="h-8 w-8 text-cafta-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cafta-gold/20 text-cafta-gold">
                  {pesquisas.length}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Gerenciamento de Pesquisas</h2>
              <p className="text-white/60 text-sm mb-4">Visualize, edite e gerencie as publicações acadêmicas</p>
              <div className="mt-6 flex items-center space-x-3 text-sm text-white/60">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
                <span>Ver pesquisas</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
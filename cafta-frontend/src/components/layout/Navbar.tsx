'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { NAV_ITEMS } from './../../lib/constants'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('section_inicio')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [pendingCount, setPendingCount] = useState<number>(0)

  // Track scroll for navbar background
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Track active section via IntersectionObserver
  useEffect(() => {
    const sectionIds = NAV_ITEMS.map((n) => n.sectionId).filter(Boolean) as string[]
    const observers: IntersectionObserver[] = []

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id)
        },
        { rootMargin: '-40% 0px -55% 0px' }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  // Fetch pending count periodically
  useEffect(() => {
    async function fetchPendingCount() {
      try {
        const res = await fetch('/api/admin/pending-count')
        if (res.ok) {
          const data = await res.json()
          setPendingCount(data.count || 0)
        }
        // If 401 (unauthorized), we don't show count - that's fine
      } catch (err) {
        // Silently ignore errors - could be network, auth, etc.
        // We don't want to spam console with fetch errors in navbar
      }
    }

    // Fetch on mount
    fetchPendingCount()

    // Fetch every 30 seconds to update count
    const interval = setInterval(fetchPendingCount, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!href.startsWith('#')) return
      e.preventDefault()
      const id = href.slice(1)
      const el = document.getElementById(id)
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 72
        window.scrollTo({ top, behavior: 'smooth' })
      }
      setMobileOpen(false)
    },
    []
  )

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-cafta-dark/95 backdrop-blur-md shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 md:px-6 flex items-center h-[72px]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image
            src="/images/LogoCafta1.png"
            alt="CAFTA Logo"
            width={40}
            height={40}
            className="object-contain"
            priority
          />
          <span className="font-bold tracking-widest text-white text-lg">CAFTA</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1 ml-auto">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-sm
                  ${
                    activeSection === item.sectionId
                      ? 'text-cafta-gold'
                      : 'text-white/70 hover:text-white'
                  }`}
              >
                {item.label}
                {activeSection === item.sectionId && (
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 bg-cafta-gold rounded-full" />
                )}
              </a>
            </li>
          ))}
        </ul>

        {/* Publicar CTA */}
        <div className="hidden md:block ml-6">
          <Link href="/upload" className="btn-cafta-outline text-xs py-2 px-4">
            Publicar
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </Link>
        </div>

        {/* Admin CTA */}
        <div className="hidden md:block ml-4 relative">
          <Link href="/admin" className="btn-cafta-primary text-xs px-4 py-2">
            Login
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-xs">
                {pendingCount > 99 ? '99+' : pendingCount}
              </span>
            )}
            <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12h6m2 0a2 2 0 110-4m0 4a2 2 0 100-4m-6 8a2 2 0 110-4m0 4a2 2 0 100-4m-6 0a2 2 0 110-4m0 4a2 2 0 100-4"/>
            </svg>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden ml-auto p-2 text-white/80 hover:text-white"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Abrir menu"
          aria-expanded={mobileOpen}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-cafta-dark/98 backdrop-blur-md border-t border-white/10">
          <ul className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`block px-3 py-3 text-sm font-medium rounded-sm transition-colors
                    ${
                      activeSection === item.sectionId
                        ? 'text-cafta-gold bg-cafta-gold/10'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <Link href="/upload" className="btn-cafta-outline block text-center text-sm">
                Publicar ↗
              </Link>
            </li>
            <li className="pt-2 relative">
              <Link href="/admin" className="btn-cafta-primary block text-center text-sm">
                Login
                {pendingCount > 0 && (
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-xs">
                    {pendingCount > 99 ? '99+' : pendingCount}
                  </span>
                )}
                <svg className="w-4 h-4 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9 12h6m2 0a2 2 0 110-4m0 4a2 2 0 100-4m-6 8a2 2 0 110-4m0 4a2 2 0 100-4m-6 0a2 2 0 110-4m0 4a2 2 0 100-4"/>
                </svg>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}

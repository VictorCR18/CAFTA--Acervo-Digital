"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import api from "@/lib/api";

interface AdminNavbarProps {
  pendingCount?: number;
}

export default function AdminNavbar({ pendingCount = 0 }: AdminNavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await api.post("/api/admin/logout");
    } catch (err) {
      console.error("[AdminNavbar] Logout error:", err);
    } finally {
      localStorage.removeItem("admin_token");
      window.location.href = "/admin/login";
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-cafta-dark/95 backdrop-blur-md shadow-lg shadow-black/20">
      <nav className="container mx-auto px-4 md:px-6 flex items-center justify-between h-[72px]">
        {/* Logo */}
        <Link href="/admin" className="flex items-center gap-3 shrink-0">
          <Image
            src="/images/LogoCafta1.png"
            alt="CAFTA Logo"
            width={36}
            height={36}
            className="object-contain"
            priority
          />
          <span className="font-bold tracking-widest text-white text-lg">
            CAFTA
            <span className="ml-2 text-xs font-normal text-white/40 tracking-normal">
              Admin
            </span>
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Pending badge */}
          {pendingCount > 0 && (
            <Link
              href="/admin/pendentes"
              className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs">
                {pendingCount > 99 ? "99+" : pendingCount}
              </span>
              Pendentes
            </Link>
          )}

          <Link
            href="/"
            className="hidden md:block text-sm text-white/60 hover:text-white transition-colors"
          >
            ← Voltar ao site
          </Link>

          {/* User dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
              aria-label="Menu do usuário"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-cafta-primary border border-white/10 rounded-lg shadow-lg z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-xs text-white/40">Logado como</p>
                  <p className="text-sm font-medium text-white">Administrador</p>
                </div>
                <div className="py-1">
                  <Link
                    href="/admin/configuracoes"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Configurações
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-white/10 hover:text-red-300 transition-colors"
                  >
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
      </nav>
    </header>
  );
}
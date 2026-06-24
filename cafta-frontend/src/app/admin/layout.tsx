"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LuArrowLeft } from "react-icons/lu";
import api from "@/lib/api";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import AdminNavbar from "@/components/layout/AdminNavbar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [pendingCount, setPendingCount] = useState<number | null>(null);

  // Variável para facilitar a verificação da rota atual
  const isLoginRoute = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginRoute) {
      setIsCheckingAuth(false);
      setPendingCount(0);
      return;
    }

    const checkAuth = async () => {
      try {
        const res = await api.get("/api/admin/pending-count");
        // assume response shape { count: number } or number directly
        const count = typeof res.data === "number" ? res.data : res.data?.count;
        setPendingCount(typeof count === "number" ? count : 0);
      } catch (err: any) {
        if (err.response?.status === 401) {
          router.replace("/admin/login");
        }
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router, isLoginRoute, pathname]);

  if (isCheckingAuth) {
    return <LoadingSpinner fullScreen message="Verificando acesso..." />;
  }

  return (
    <div className="relative min-h-screen">
      {isLoginRoute ? (
        // Renderiza o botão de voltar à Home de forma isolada na tela de login
        <div className="absolute top-6 left-6 z-50">
          <Link 
            href="/" 
            className="flex items-center text-sm font-medium text-white/60 hover:text-white transition-colors group"
          >
            <LuArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
            Voltar para o Início
          </Link>
        </div>
      ) : (
        // Renderiza a Navbar padrão para as demais páginas (Dashboard, Moderação, etc.)
        <div className="bg-cafta-primary/50 border-b border-white/10">
          <div className="container mx-auto mt-10 px-4 md:px-6 py-4">
            <AdminNavbar pendingCount={pendingCount ?? 0} />
          </div>
        </div>
      )}
      
      <main>
        {children}
      </main>
    </div>
  );
}
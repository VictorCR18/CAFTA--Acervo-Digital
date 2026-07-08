"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import FeedbackPopup from "@/components/ui/FeedbackPopup";
import {
  LuArrowLeft,
  LuLock,
  LuEye,
  LuEyeOff,
  LuShieldCheck,
  LuLogOut,
  LuLoaderCircle,
} from "react-icons/lu";

export default function AdminConfiguracoesPage() {
  const router = useRouter();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [feedback, setFeedback] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      setFeedback({ message: "Preencha todos os campos.", type: "error" });
      return;
    }
    if (newPassword.length < 6) {
      setFeedback({
        message: "A nova senha deve ter ao menos 6 caracteres.",
        type: "error",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setFeedback({
        message: "A confirmação não coincide com a nova senha.",
        type: "error",
      });
      return;
    }
    if (newPassword === oldPassword) {
      setFeedback({
        message: "A nova senha deve ser diferente da senha atual.",
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      await api.put("/api/admin/password", { oldPassword, newPassword });
      setFeedback({
        message: "Senha atualizada com sucesso.",
        type: "success",
      });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        "Não foi possível atualizar a senha. Tente novamente.";
      setFeedback({ message: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await api.post("/api/admin/logout");
    } catch {
    } finally {
      localStorage.removeItem("admin_token");
      router.push("/admin/login");
    }
  };

  return (
    <main className="min-h-screen bg-cafta-dark">
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl">
          <div className="flex items-center gap-4 mb-10">
            <Link
              href="/admin"
              className="flex items-center justify-center text-white/60 hover:text-white transition-colors p-2 -ml-2 rounded-md hover:bg-white/5"
              aria-label="Voltar ao painel"
            >
              <LuArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <span className="section-eyebrow mb-1 block">Admin</span>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Configurações
              </h1>
              <p className="text-white/50 text-sm mt-1">
                Gerencie a segurança da sua conta de administrador.
              </p>
            </div>
          </div>

          <div className="border border-white/10 rounded-lg bg-white/[0.02] p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-md bg-cafta-gold/10 flex items-center justify-center text-cafta-gold shrink-0">
                <LuShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-white font-semibold text-base">
                  Alterar senha
                </h2>
                <p className="text-white/40 text-xs mt-0.5">
                  Use uma senha forte que você ainda não tenha utilizado.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="oldPassword"
                  className="block text-white/70 text-xs font-medium mb-2"
                >
                  Senha atual
                </label>
                <div className="relative">
                  <LuLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    id="oldPassword"
                    type={showOld ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    autoComplete="current-password"
                    placeholder="Digite sua senha atual"
                    className="w-full bg-white/5 border border-white/10 rounded-md pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-cafta-gold/40 focus:border-cafta-gold/40 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOld((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                    aria-label={showOld ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showOld ? (
                      <LuEyeOff className="w-4 h-4" />
                    ) : (
                      <LuEye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="h-px bg-white/5" />

              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-white/70 text-xs font-medium mb-2"
                >
                  Nova senha
                </label>
                <div className="relative">
                  <LuLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    id="newPassword"
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                    placeholder="Mínimo de 6 caracteres"
                    className="w-full bg-white/5 border border-white/10 rounded-md pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-cafta-gold/40 focus:border-cafta-gold/40 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                    aria-label={showNew ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showNew ? (
                      <LuEyeOff className="w-4 h-4" />
                    ) : (
                      <LuEye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-white/70 text-xs font-medium mb-2"
                >
                  Confirmar nova senha
                </label>
                <div className="relative">
                  <LuLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    placeholder="Repita a nova senha"
                    className="w-full bg-white/5 border border-white/10 rounded-md pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-cafta-gold/40 focus:border-cafta-gold/40 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                    aria-label={showConfirm ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showConfirm ? (
                      <LuEyeOff className="w-4 h-4" />
                    ) : (
                      <LuEye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-cafta-primary w-full justify-center py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
              >
                {loading && <LuLoaderCircle className="w-4 h-4 animate-spin" />}
                {loading ? "Salvando..." : "Salvar nova senha"}
              </button>
            </form>
          </div>

          <div className="border border-white/10 rounded-lg bg-white/[0.02] p-6 md:p-8 mt-6 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-white font-semibold text-sm">Sessão</h2>
              <p className="text-white/40 text-xs mt-0.5">
                Encerrar o acesso neste dispositivo.
              </p>
            </div>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="btn-cafta-outline text-xs py-2 px-4 inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loggingOut ? (
                <LuLoaderCircle className="w-4 h-4 animate-spin" />
              ) : (
                <LuLogOut className="w-4 h-4" />
              )}
              Sair
            </button>
          </div>
        </div>
      </section>

      {feedback && (
        <FeedbackPopup
          message={feedback.message}
          type={feedback.type}
          onClose={() => setFeedback(null)}
        />
      )}
    </main>
  );
}

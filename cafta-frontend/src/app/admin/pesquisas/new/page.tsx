"use client"

import { useState } from 'react'
import PesquisaForm from '@/components/PesquisaForm'
import { useRouter } from 'next/navigation'
import FeedbackPopup from '@/components/ui/FeedbackPopup' // <-- Importando o popup

export default function NewPesquisaPage() {
  const router = useRouter()
  
  // Estado para controlar o popup
  const [popup, setPopup] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
    show: false,
    message: "",
    type: "success",
  })

  const handleSubmitSuccess = (pesquisa: any) => {
    // Exibe o popup de sucesso
    setPopup({ show: true, message: 'Pesquisa criada com sucesso!', type: 'success' })
    
    // Aguarda 2 segundos para o usuário ler a mensagem antes de redirecionar
    setTimeout(() => {
      router.push('/admin/pesquisas')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-cafta-dark p-6 relative">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Nova Pesquisa</h1>
          <p className="mt-2 text-sm text-white/60">
            Preencha o formulário abaixo para adicionar uma nova publicação acadêmica
          </p>
        </div>
        <PesquisaForm onSubmitSuccess={handleSubmitSuccess} />
      </div>

      {/* Renderizando o Popup */}
      {popup.show && (
        <FeedbackPopup
          message={popup.message}
          type={popup.type}
          onClose={() => setPopup((prev) => ({ ...prev, show: false }))}
        />
      )}
    </div>
  )
}
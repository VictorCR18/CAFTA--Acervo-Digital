"use client"

import PesquisaForm from '@/components/PesquisaForm'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function NewPesquisaPage() {
  const router = useRouter()

  const handleSubmitSuccess = (pesquisa: any) => {
    // In a real app, you would update the item via API
    // For now, we'll just show a success message
    console.log('Pesquisa criada com sucesso:', pesquisa)
    alert('Pesquisa criada com sucesso!')
    router.push('/admin/pesquisas')
  }

  return (
    <div className="min-h-screen bg-cafta-dark p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Nova Pesquisa</h1>
          <p className="mt-2 text-sm text-white/60">
            Preencha o formulário abaixo para adicionar uma nova publicação acadêmica
          </p>
        </div>
        <PesquisaForm onSubmitSuccess={handleSubmitSuccess} />
      </div>
    </div>
  )
}
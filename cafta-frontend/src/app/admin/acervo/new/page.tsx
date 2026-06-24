"use client";

import { useSearchParams } from "next/navigation";
import AcervoForm from '../../../../components/AcervoForm'
import type { AcervoTipo, AcervoItem } from '@/types'

export default function NewAcervoPage() {
  const searchParams = useSearchParams()
  const tipoParam = searchParams.get('tipo')
  const tipo = tipoParam === 'imagens' || tipoParam === 'videos' || tipoParam === 'artigos'
    ? tipoParam as AcervoTipo
    : undefined

  const handleSubmitSuccess = (item: any) => {
    // You can add any additional logic here if needed
    console.log('Item created successfully:', item)
  }

  // Prepare initial data with tipo if provided
  const initialData = tipo ? ({ tipo } as AcervoItem) : undefined

  return (
    <div className="min-h-screen bg-cafta-dark p-6">
      <div className="max-w-2xl mx-auto">
        <AcervoForm initialData={initialData} onSubmitSuccess={handleSubmitSuccess} />
      </div>
    </div>
  )
}
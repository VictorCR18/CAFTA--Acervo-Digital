"use client"

import AcervoForm from '../../../../components/AcervoForm'

export default function NewAcervoPage() {
  const handleSubmitSuccess = (item: any) => {
    // You can add any additional logic here if needed
    console.log('Item created successfully:', item)
  }

  return (
    <div className="min-h-screen bg-cafta-dark p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Add New Acervo Item</h1>
          <p className="mt-2 text-sm text-white/60">
            Fill out the form below to add a new item to the digital archive
          </p>
        </div>
        <AcervoForm onSubmitSuccess={handleSubmitSuccess} />
      </div>
    </div>
  )
}
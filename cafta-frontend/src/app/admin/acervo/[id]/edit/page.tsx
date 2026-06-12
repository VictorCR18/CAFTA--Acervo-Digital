"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AcervoForm from "@/components/AcervoForm";
import { mockAcervoData } from "@/lib/mockAcervoData";
import type { AcervoItem } from "@/types";
import Link from "next/link";

export default function EditAcervoPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<AcervoItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch item from mock data (in real app, this would be an API call)
    const fetchItem = () => {
      setLoading(true);
      const foundItem = mockAcervoData.find((item) => item.id === id);
      if (foundItem) {
        setItem(foundItem);
      } else {
        // Item not found, redirect to list
        router.push("/admin/acervo");
      }
      setLoading(false);
    };

    fetchItem();
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cafta-dark flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-cafta-dark flex items-center justify-center">
        <div className="text-white">Item não encontrado</div>
      </div>
    );
  }

  const handleSubmitSuccess = (updatedItem: any) => {
    // In a real app, you would update the item via API
    // For now, we'll just update the mock data (not persistent)
    console.log("Item atualizado com sucesso:", updatedItem);
    router.push("/admin/acervo");
  };

  return (
    <div className="min-h-screen bg-cafta-dark">
      {/* Header */}
      <div className="bg-cafta-primary/50 border-b border-white/10">
        <div className="container mx-auto px-4 md:px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Editar Item do Acervo</h1>
              <p className="mt-1 text-sm text-white/60">
                Atualize os detalhes de "{item?.title ?? ''}"
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/admin/acervo" className="text-sm font-medium text-white hover:text-cafta-gold">
                Voltar ao acervo
              </Link>
              <Link href="/" className="text-sm font-medium text-white hover:text-cafta-gold">
                Voltar ao site
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Editar Item do Acervo</h1>
          <p className="mt-2 text-sm text-white/60">
            Atualize os detalhes de "{item?.title ?? ''}"
          </p>
        </div>
        <AcervoForm initialData={item} onSubmitSuccess={handleSubmitSuccess} />
      </div>
    </div>
  );
}

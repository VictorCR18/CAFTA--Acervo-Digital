"use client";

import { useSearchParams } from "next/navigation";
import AcervoForm from "../../../../components/AcervoForm";
import type { AcervoTipo, AcervoItem } from "@/types";

export default function NewAcervoPage() {
  const searchParams = useSearchParams();
  const tipoParam = searchParams.get("tipo");
  const tipo =
    tipoParam === "imagens" || tipoParam === "videos" || tipoParam === "artigos"
      ? (tipoParam as AcervoTipo)
      : undefined;

  const handleSubmitSuccess = (item: any) => {
    console.log("Item created successfully:", item);
  };

  const initialData = tipo ? ({ tipo } as AcervoItem) : undefined;

  return (
    <div className="min-h-screen bg-cafta-dark p-6">
      <div className="max-w-2xl mx-auto">
        <AcervoForm
          initialData={initialData}
          onSubmitSuccess={handleSubmitSuccess}
        />
      </div>
    </div>
  );
}

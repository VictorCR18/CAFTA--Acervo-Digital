"use client";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmDeleteModal({
  isOpen,
  title,
  description = "Essa ação não pode ser desfeita e o item será removido permanentemente.",
  isDeleting,
  onClose,
  onConfirm,
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-cafta-primary border border-white/10 rounded-lg p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-white/70 text-sm mb-6">{description}</p>
        
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 rounded-md transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50 flex items-center"
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Excluindo...
              </>
            ) : (
              "Sim, excluir"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
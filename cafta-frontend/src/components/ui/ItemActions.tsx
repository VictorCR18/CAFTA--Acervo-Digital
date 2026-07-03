"use client";

import { useState, useRef, useEffect } from "react";

export function ItemActions({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-white/60 hover:text-white transition-colors"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="5" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="19" r="2" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-cafta-primary border border-white/10 rounded-md shadow-xl z-50 py-1">
          <button
            onClick={() => {
              onEdit();
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10"
          >
            Editar
          </button>
          <button
            onClick={() => {
              onDelete();
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
          >
            Excluir
          </button>
        </div>
      )}
    </div>
  );
}

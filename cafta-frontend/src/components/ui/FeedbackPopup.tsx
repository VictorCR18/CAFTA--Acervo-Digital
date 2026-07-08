"use client";

import { useEffect } from "react";

interface FeedbackPopupProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export default function FeedbackPopup({
  message,
  type,
  onClose,
}: FeedbackPopupProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === "success";

  return (
    <div
      className={`fixed bottom-6 right-6 flex items-center p-4 rounded-md shadow-lg border z-50 transition-all transform animate-in slide-in-from-bottom-5 fade-in duration-300 ${
        isSuccess
          ? "bg-[#0A1A10] border-green-500/30 text-green-400"
          : "bg-[#1A0A0A] border-red-500/30 text-red-400"
      }`}
      role="alert"
    >
      {isSuccess ? (
        <svg
          className="w-5 h-5 mr-3 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ) : (
        <svg
          className="w-5 h-5 mr-3 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      )}

      <span className="font-medium text-sm mr-4">{message}</span>

      <button
        onClick={onClose}
        className="ml-auto text-white/40 hover:text-white transition-colors"
        aria-label="Fechar"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}

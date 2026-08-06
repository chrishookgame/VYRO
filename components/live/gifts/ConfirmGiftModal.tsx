"use client";

import type {
  LiveGiftCatalogItem,
} from "@/lib/live";

interface ConfirmGiftModalProps {
  gift: LiveGiftCatalogItem | null;
  open: boolean;
  sending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmGiftModal({
  gift,
  open,
  sending,
  onCancel,
  onConfirm,
}: ConfirmGiftModalProps) {
  if (!open || !gift) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-6 backdrop-blur-sm">
      <section className="w-full max-w-md rounded-[2rem] border border-cyan-400/20 bg-[#07111D] p-6 text-center shadow-2xl">
        <div className="text-6xl">
          {gift.icon}
        </div>

        <h2 className="mt-4 text-2xl font-black text-white">
          Enviar {gift.name}
        </h2>

        <p className="mt-3 text-gray-400">
          Se descontarán {gift.price} unidades VYRO de tu saldo.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={sending}
            className="flex-1 rounded-2xl border border-white/10 px-4 py-3 font-bold text-gray-300 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={sending}
            className="flex-1 rounded-2xl bg-cyan-300 px-4 py-3 font-black text-black disabled:opacity-50"
          >
            {sending
              ? "Enviando..."
              : "Enviar regalo"}
          </button>
        </div>
      </section>
    </div>
  );
}

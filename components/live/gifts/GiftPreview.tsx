"use client";

import type {
  LiveGiftCatalogItem,
} from "@/lib/live";

interface GiftPreviewProps {
  gift: LiveGiftCatalogItem | null;
}

export default function GiftPreview({
  gift,
}: GiftPreviewProps) {
  if (!gift) {
    return (
      <div className="rounded-3xl border border-dashed border-white/10 p-6 text-center text-sm text-gray-500">
        Selecciona un regalo para ver la vista previa.
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-cyan-400/15 bg-cyan-400/[0.04] p-6 text-center">
      <div className="text-6xl">
        {gift.icon}
      </div>

      <h3 className="mt-4 text-xl font-black text-white">
        {gift.name}
      </h3>

      <p className="mt-2 text-sm text-gray-400">
        Precio: {gift.price} unidades VYRO
      </p>

      <p className="mt-1 text-sm text-cyan-300">
        Energía: +{gift.energyValue}
      </p>
    </div>
  );
}

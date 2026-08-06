"use client";

import type {
  LiveGiftCatalogItem,
} from "@/lib/live";

interface GiftCardProps {
  gift: LiveGiftCatalogItem;
  selected: boolean;
  onSelect: (
    gift: LiveGiftCatalogItem,
  ) => void;
}

export default function GiftCard({
  gift,
  selected,
  onSelect,
}: GiftCardProps) {
  return (
    <button
      type="button"
      onClick={() => {
        onSelect(gift);
      }}
      className={`rounded-3xl border p-4 text-left transition ${
        selected
          ? "border-cyan-300 bg-cyan-300/10"
          : "border-white/10 bg-white/[0.03] hover:border-cyan-400/40"
      }`}
    >
      <div className="text-4xl">
        {gift.icon}
      </div>

      <h3 className="mt-3 text-sm font-black text-white">
        {gift.name}
      </h3>

      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-sm font-black text-cyan-300">
          {gift.price}
        </span>

        <span className="text-xs text-gray-500">
          ⚡ {gift.energyValue}
        </span>
      </div>

      <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500">
        {gift.rarity}
      </p>
    </button>
  );
}

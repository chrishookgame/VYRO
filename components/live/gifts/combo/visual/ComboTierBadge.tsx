"use client";

import type {
  GiftComboTier,
} from "../types";

interface ComboTierBadgeProps {
  tier: GiftComboTier;
  multiplier: number;
}

const tierLabels: Record<
  GiftComboTier,
  string
> = {
  starter: "Starter",
  boost: "Boost",
  super: "Super",
  mega: "Mega",
  ultra: "Ultra",
  mythic: "Mythic",
};

const tierStyles: Record<
  GiftComboTier,
  string
> = {
  starter:
    "border-cyan-300/25 bg-cyan-400/10 text-cyan-100",
  boost:
    "border-blue-300/30 bg-blue-400/10 text-blue-100",
  super:
    "border-violet-300/35 bg-violet-400/10 text-violet-100",
  mega:
    "border-fuchsia-300/40 bg-fuchsia-400/10 text-fuchsia-100",
  ultra:
    "border-yellow-300/45 bg-yellow-400/10 text-yellow-100",
  mythic:
    "border-orange-300/50 bg-orange-400/10 text-orange-100",
};

export default function ComboTierBadge({
  tier,
  multiplier,
}: ComboTierBadgeProps) {
  return (
    <div
      className={`inline-flex items-center gap-3 rounded-full border px-4 py-2 shadow-lg backdrop-blur-md ${tierStyles[tier]}`}
    >
      <span className="text-xs font-black uppercase tracking-[0.22em]">
        {tierLabels[tier]}
      </span>

      <span className="rounded-full bg-black/20 px-3 py-1 text-xs font-black">
        ×{multiplier.toFixed(2)}
      </span>
    </div>
  );
}

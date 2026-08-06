"use client";

import type {
  GiftComboTier,
} from "../types";

interface ComboCounterProps {
  count: number;
  tier: GiftComboTier;
}

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

const tierSizes: Record<
  GiftComboTier,
  string
> = {
  starter: "text-5xl",
  boost: "text-6xl",
  super: "text-6xl md:text-7xl",
  mega: "text-7xl md:text-8xl",
  ultra: "text-8xl md:text-9xl",
  mythic: "text-9xl md:text-[10rem]",
};

export default function ComboCounter({
  count,
  tier,
}: ComboCounterProps) {
  return (
    <div
      className={`rounded-[2rem] border px-6 py-5 text-center shadow-[0_20px_70px_rgba(0,0,0,0.45)] backdrop-blur-md ${tierStyles[tier]}`}
    >
      <p className="text-xs font-black uppercase tracking-[0.28em] opacity-70">
        VYRO COMBO
      </p>

      <div
        className={`mt-2 font-black leading-none drop-shadow-[0_10px_30px_rgba(255,255,255,0.18)] ${tierSizes[tier]}`}
      >
        ×{Math.max(count, 1)}
      </div>
    </div>
  );
}

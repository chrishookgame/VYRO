"use client";

import type {
  LiveGiftRarity,
} from "@/lib/live";

interface GiftAnimationProps {
  icon: string;
  title: string;
  rarity: LiveGiftRarity;
  amount: number;
  energyAdded: number;
  animationKey: string;
  queuedGifts?: number;
}

const rarityStyles: Record<
  LiveGiftRarity,
  string
> = {
  common:
    "border-cyan-300/30 bg-cyan-950/90 shadow-cyan-500/20",
  rare:
    "border-blue-300/40 bg-blue-950/90 shadow-blue-500/30",
  epic:
    "border-violet-300/50 bg-violet-950/90 shadow-violet-500/40",
  legendary:
    "border-yellow-300/60 bg-yellow-950/90 shadow-yellow-500/50",
  mythic:
    "border-fuchsia-300/70 bg-[#16051f]/95 shadow-fuchsia-500/60",
};

const iconSizes: Record<
  LiveGiftRarity,
  string
> = {
  common: "text-7xl",
  rare: "text-8xl",
  epic: "text-8xl md:text-9xl",
  legendary: "text-9xl md:text-[10rem]",
  mythic: "text-[9rem] md:text-[12rem]",
};

export default function GiftAnimation({
  icon,
  title,
  rarity,
  amount,
  energyAdded,
  animationKey,
  queuedGifts = 0,
}: GiftAnimationProps) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[80] flex items-center justify-center overflow-hidden bg-black/25 p-6 backdrop-blur-[2px]">
      <div
        data-animation-key={animationKey}
        className={`relative w-full max-w-xl animate-bounce overflow-hidden rounded-[2.5rem] border p-8 text-center shadow-[0_35px_120px_rgba(0,0,0,0.65)] ${rarityStyles[rarity]}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.16),transparent_65%)]" />

        <div className="absolute -left-16 -top-16 h-40 w-40 animate-pulse rounded-full bg-white/10 blur-3xl" />

        <div className="absolute -bottom-16 -right-16 h-40 w-40 animate-pulse rounded-full bg-cyan-300/10 blur-3xl" />

        <div className="relative">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-white/70">
            VYRO LIVE GIFT
          </p>

          <div
            className={`mt-5 drop-shadow-[0_12px_35px_rgba(255,255,255,0.35)] ${iconSizes[rarity]}`}
          >
            {icon}
          </div>

          <h2 className="mt-5 text-3xl font-black text-white md:text-4xl">
            {title}
          </h2>

          <p className="mt-2 text-sm font-black uppercase tracking-[0.24em] text-cyan-200">
            {rarity}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <span className="rounded-full border border-white/15 bg-black/25 px-4 py-2 text-sm font-black text-white">
              {amount.toLocaleString(
                "es-419",
              )} VYRO
            </span>

            <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-black text-cyan-200">
              ⚡ +{energyAdded.toLocaleString(
                "es-419",
              )}
            </span>
          </div>

          {queuedGifts > 0 ? (
            <p className="mt-5 text-xs font-bold text-white/60">
              {queuedGifts} regalo
              {queuedGifts === 1
                ? ""
                : "s"}{" "}
              en espera
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

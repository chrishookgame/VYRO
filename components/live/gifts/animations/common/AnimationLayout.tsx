"use client";

import type {
  PropsWithChildren,
} from "react";

import type {
  LiveGiftRarity,
} from "@/lib/live";

interface AnimationLayoutProps
  extends PropsWithChildren {
  rarity: LiveGiftRarity;
  title: string;
  subtitle?: string;
}

const rarityStyles: Record<
  LiveGiftRarity,
  string
> = {
  common:
    "border-cyan-300/30 bg-cyan-950/90",
  rare:
    "border-blue-300/40 bg-blue-950/90",
  epic:
    "border-violet-300/50 bg-violet-950/90",
  legendary:
    "border-yellow-300/60 bg-yellow-950/90",
  mythic:
    "border-fuchsia-300/70 bg-[#16051f]/95",
};

export default function AnimationLayout({
  rarity,
  title,
  subtitle,
  children,
}: AnimationLayoutProps) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center overflow-hidden bg-black/30 p-6 backdrop-blur-[2px]">
      <section
        className={`relative w-full max-w-2xl overflow-hidden rounded-[2.75rem] border p-8 text-center shadow-[0_35px_140px_rgba(0,0,0,0.7)] ${rarityStyles[rarity]}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.16),transparent_68%)]" />

        <div className="relative">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-white/65">
            VYRO CINEMATIC GIFT
          </p>

          {children}

          <h2 className="mt-5 text-3xl font-black text-white md:text-5xl">
            {title}
          </h2>

          {subtitle ? (
            <p className="mt-3 text-sm font-bold text-cyan-200">
              {subtitle}
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}

"use client";

import type {
  PropsWithChildren,
} from "react";

import type {
  LiveGiftRarity,
} from "@/lib/live";

import GiftPresentationStage from "./GiftPresentationStage";

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
    <GiftPresentationStage>
      <div className="relative flex h-full w-full items-end justify-center px-3 pb-3" data-vyro-layout="VYRO_STANDARD_GIFT_PRESENTATION">
        <section
        className={`relative w-full max-w-xl overflow-hidden rounded-[1.75rem] border px-5 py-4 text-center shadow-[0_20px_70px_rgba(0,0,0,0.55)] backdrop-blur-md ${rarityStyles[rarity]}`}
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
    </GiftPresentationStage>
  );
}

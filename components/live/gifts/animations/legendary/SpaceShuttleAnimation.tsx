"use client";

import type {
  GiftAnimationComponentProps,
} from "../types";

import {
  AnimationLayout,
  GlowEffect,
  ParticleSystem,
  ScreenFlash,
  SoundPlayer,
} from "../common";

import {
  getGiftAnimationConfiguration,
} from "../configs";

export default function SpaceShuttleAnimation({
  gift,
}: GiftAnimationComponentProps) {
  const config =
    getGiftAnimationConfiguration(
      gift.animationKey,
    );

  return (
    <AnimationLayout
      rarity={gift.rarity}
      title={gift.name}
      subtitle={`${gift.amount.toLocaleString("es-419")} VYRO · ⚡ +${gift.energyAdded.toLocaleString("es-419")}`}
    >
      <GlowEffect
        className={
          config.visual.glowClassName
        }
      />

      <ScreenFlash
        intensity={
          config.visual.flashIntensity ===
          "none"
            ? "soft"
            : config.visual.flashIntensity
        }
      />

      <ParticleSystem
        symbols={
          config.particles.symbols
        }
        count={
          config.particles.count
        }
      />

      <SoundPlayer
        soundKey={
          config.audio.soundKey
        }
      />

      <div className="relative flex min-h-80 items-center justify-center overflow-hidden rounded-[2rem]">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-950 via-[#050816] to-black" />

        <div className="absolute left-[8%] top-[12%] animate-pulse text-3xl">
          ⭐
        </div>

        <div className="absolute right-[10%] top-[20%] animate-pulse text-4xl">
          ✨
        </div>

        <div className="absolute left-[20%] top-[34%] animate-pulse text-2xl opacity-70">
          ⭐
        </div>

        <div className="absolute bottom-0 left-1/2 h-48 w-24 -translate-x-1/2 rounded-full bg-orange-400/70 blur-3xl" />

        <div className="absolute bottom-8 left-1/2 h-28 w-16 -translate-x-1/2 rounded-full bg-yellow-200/80 blur-2xl" />

        <div className="relative animate-bounce text-[10rem] drop-shadow-[0_0_70px_rgba(56,189,248,0.8)] md:text-[13rem]">
          🚀
        </div>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-6xl drop-shadow-[0_0_35px_rgba(249,115,22,0.9)]">
          🔥
        </div>
      </div>

      <div className="relative mt-5 flex flex-wrap justify-center gap-3">
        <span className="rounded-full border border-sky-300/30 bg-sky-300/10 px-5 py-2 text-xs font-black uppercase tracking-[0.25em] text-sky-100">
          Space Launch
        </span>

        <span className="rounded-full border border-white/10 bg-black/20 px-5 py-2 text-xs font-black uppercase tracking-[0.25em] text-white/80">
          Mythic
        </span>
      </div>
    </AnimationLayout>
  );
}

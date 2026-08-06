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

export default function DragonAnimation({
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

      <div className="relative mt-6 flex min-h-72 items-center justify-center overflow-hidden">
        <div className="absolute h-64 w-64 animate-pulse rounded-full bg-orange-500/20 blur-3xl" />

        <div className="absolute left-[8%] top-[18%] text-5xl opacity-70">
          🔥
        </div>

        <div className="absolute right-[10%] top-[26%] text-4xl opacity-60">
          🔥
        </div>

        <div className="absolute bottom-[16%] left-1/2 h-12 w-80 -translate-x-1/2 rounded-full bg-orange-400/30 blur-2xl" />

        <div className="relative animate-bounce text-[9rem] drop-shadow-[0_25px_65px_rgba(249,115,22,0.8)] md:text-[12rem]">
          🐉
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-6xl opacity-90">
          🔥
        </div>
      </div>

      <div className="relative mt-4 flex flex-wrap justify-center gap-3">
        <span className="rounded-full border border-orange-300/20 bg-orange-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-orange-100">
          Dragon Fire
        </span>

        <span className="rounded-full border border-red-300/20 bg-red-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-red-100">
          Mythic
        </span>
      </div>
    </AnimationLayout>
  );
}

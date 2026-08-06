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

export default function CrownAnimation({
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

      <div className="relative mt-8 flex min-h-64 items-center justify-center">
        <div className="absolute h-56 w-56 animate-pulse rounded-full border border-yellow-200/20 bg-yellow-300/10 blur-2xl" />

        <div className="absolute h-44 w-44 rounded-full border border-yellow-100/30 shadow-[0_0_80px_rgba(250,204,21,0.5)]" />

        <div className="relative animate-bounce text-[9rem] drop-shadow-[0_20px_55px_rgba(250,204,21,0.75)] md:text-[12rem]">
          👑
        </div>

        <div className="absolute bottom-3 left-1/2 h-4 w-72 -translate-x-1/2 rounded-full bg-yellow-200/25 blur-xl" />
      </div>

      <div className="relative mt-4 flex flex-wrap justify-center gap-3">
        <span className="rounded-full border border-yellow-200/20 bg-yellow-200/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-yellow-100">
          Royal Energy
        </span>

        <span className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white/75">
          Legendary
        </span>
      </div>
    </AnimationLayout>
  );
}

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

export default function GoldenPalaceAnimation({
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
          config.visual.flashIntensity === "none"
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

      <div className="relative flex min-h-80 items-center justify-center overflow-hidden">

        <div className="absolute h-72 w-72 rounded-full bg-yellow-300/20 blur-3xl animate-pulse"/>

        <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-yellow-300 via-amber-500 to-yellow-100"/>

        <div className="relative text-[10rem] md:text-[13rem] animate-bounce drop-shadow-[0_0_80px_rgba(255,215,0,.8)]">
          🏰
        </div>

      </div>

      <div className="mt-5 flex justify-center gap-3 flex-wrap">

        <span className="rounded-full border border-yellow-300/30 bg-yellow-300/10 px-5 py-2 text-xs font-black uppercase tracking-[0.25em] text-yellow-100">
          Golden Palace
        </span>

        <span className="rounded-full border border-white/10 bg-black/20 px-5 py-2 text-xs font-black uppercase tracking-[0.25em] text-white/80">
          Mythic
        </span>

      </div>

    </AnimationLayout>
  );

}

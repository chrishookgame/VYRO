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

export default function VyroUniverseAnimation({
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
        className={config.visual.glowClassName}
      />

      <ScreenFlash
        intensity={
          config.visual.flashIntensity === "none"
            ? "soft"
            : config.visual.flashIntensity
        }
      />

      <ParticleSystem
        symbols={config.particles.symbols}
        count={config.particles.count}
      />

      <SoundPlayer
        soundKey={config.audio.soundKey}
      />

      <div className="relative flex min-h-[34rem] items-center justify-center overflow-hidden rounded-[2rem]">

        <div className="absolute inset-0 bg-gradient-to-b from-[#02030A] via-[#080B1A] to-black"/>

        <div className="absolute inset-0 opacity-70">

          <div className="absolute left-[8%] top-[10%] animate-pulse text-3xl">⭐</div>
          <div className="absolute left-[25%] top-[22%] animate-pulse text-2xl">✨</div>
          <div className="absolute left-[75%] top-[18%] animate-pulse text-4xl">⭐</div>
          <div className="absolute left-[84%] top-[62%] animate-pulse text-3xl">✨</div>
          <div className="absolute left-[16%] top-[70%] animate-pulse text-3xl">⭐</div>

        </div>

        <div className="absolute h-[26rem] w-[26rem] rounded-full bg-fuchsia-500/20 blur-3xl"/>

        <div className="absolute h-[20rem] w-[20rem] rounded-full border border-cyan-400/40"/>

        <div className="relative text-[12rem] md:text-[15rem] animate-pulse drop-shadow-[0_0_90px_rgba(147,51,234,.9)]">
          🪐
        </div>

      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3">

        <span className="rounded-full border border-fuchsia-400/40 bg-fuchsia-500/10 px-5 py-2 text-xs font-black uppercase tracking-[0.25em] text-fuchsia-100">
          VYRO Universe
        </span>

        <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-xs font-black uppercase tracking-[0.25em] text-cyan-100">
          Ultimate Mythic
        </span>

      </div>

    </AnimationLayout>

  );

}

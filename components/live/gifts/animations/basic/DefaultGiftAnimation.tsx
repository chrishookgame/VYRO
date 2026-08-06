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

export default function DefaultGiftAnimation({
  gift,
}: GiftAnimationComponentProps) {
  return (
    <AnimationLayout
      rarity={gift.rarity}
      title={gift.name}
      subtitle={`${gift.amount.toLocaleString("es-419")} VYRO · ⚡ +${gift.energyAdded.toLocaleString("es-419")}`}
    >
      <GlowEffect />
      <ScreenFlash intensity="soft" />
      <ParticleSystem
        symbols={[gift.icon, "✨"]}
        count={16}
      />
      <SoundPlayer
        soundKey={gift.animationKey}
      />

      <div className="relative mt-6 text-8xl drop-shadow-[0_15px_40px_rgba(255,255,255,0.35)] md:text-9xl">
        {gift.icon}
      </div>
    </AnimationLayout>
  );
}

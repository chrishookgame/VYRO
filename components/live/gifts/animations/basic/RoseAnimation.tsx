"use client";

import type {
  GiftAnimationComponentProps,
} from "../types";
import {
  AnimationLayout,
  GlowEffect,
  ParticleSystem,
  SoundPlayer,
} from "../common";

export default function RoseAnimation({
  gift,
}: GiftAnimationComponentProps) {
  return (
    <AnimationLayout
      rarity={gift.rarity}
      title={gift.name}
      subtitle="Pétalos de energía positiva"
    >
      <GlowEffect className="bg-rose-300/15" />
      <ParticleSystem
        symbols={["🌹", "🌸", "✨"]}
        count={24}
      />
      <SoundPlayer soundKey="rose" />

      <div className="relative mt-6 animate-bounce text-8xl md:text-9xl">
        🌹
      </div>
    </AnimationLayout>
  );
}

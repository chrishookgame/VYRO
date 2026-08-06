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

export default function HeartAnimation({
  gift,
}: GiftAnimationComponentProps) {
  return (
    <AnimationLayout
      rarity={gift.rarity}
      title={gift.name}
      subtitle="Amor compartido en VYRO LIVE"
    >
      <GlowEffect className="bg-pink-300/15" />
      <ScreenFlash intensity="soft" />
      <ParticleSystem
        symbols={["❤️", "💖", "💕"]}
        count={26}
      />
      <SoundPlayer soundKey="heart" />

      <div className="relative mt-6 animate-pulse text-8xl md:text-9xl">
        ❤️
      </div>
    </AnimationLayout>
  );
}

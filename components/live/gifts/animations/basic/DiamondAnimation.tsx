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

export default function DiamondAnimation({
  gift,
}: GiftAnimationComponentProps) {
  return (
    <AnimationLayout
      rarity={gift.rarity}
      title={gift.name}
      subtitle="Cristales de energía VYRO"
    >
      <GlowEffect className="bg-cyan-200/20" />
      <ScreenFlash intensity="medium" />
      <ParticleSystem
        symbols={["💎", "✦", "✨"]}
        count={30}
      />
      <SoundPlayer soundKey="diamond" />

      <div className="relative mt-6 animate-bounce text-8xl drop-shadow-[0_0_40px_rgba(103,232,249,0.8)] md:text-[10rem]">
        💎
      </div>
    </AnimationLayout>
  );
}

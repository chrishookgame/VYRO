"use client";

import type {
  GiftAnimationComponentProps,
} from "../types";

import GiftPresentationStage from "../common/GiftPresentationStage";

import {
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
    <GiftPresentationStage>
      <div className="pointer-events-none absolute inset-0 z-[120] overflow-hidden bg-black">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/visuals/gifts/space-shuttle/vyro-space-shuttle-cinematic.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
      />

      <SoundPlayer
        soundKey={
          config.audio.soundKey
        }
        volume={
          config.audio.volume
        }
        pitch={
          config.audio.pitch
        }
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center px-4">
        <div className="rounded-full border border-white/20 bg-black/55 px-6 py-3 text-center shadow-2xl backdrop-blur-md">
          <div className="text-sm font-black uppercase tracking-[0.28em] text-white">
            {gift.name}
          </div>

          <div className="mt-1 text-xs font-bold text-white/80">
            {gift.amount.toLocaleString("es-419")} VYRO
          </div>
        </div>
      </div>
      </div>
    </GiftPresentationStage>
  );
}

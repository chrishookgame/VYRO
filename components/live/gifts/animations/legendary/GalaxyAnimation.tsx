"use client";

import type {
  GiftAnimationComponentProps,
} from "../types";

import GiftPresentationStage from "../common/GiftPresentationStage";
import SoundPlayer from "../common/SoundPlayer";
import VyroGiftFxStage from "../common/VyroGiftFxStage";

export default function GalaxyAnimation({
  gift,
}: GiftAnimationComponentProps) {
  return (
    <GiftPresentationStage>
      <VyroGiftFxStage
        theme="galaxy"
        title={gift.name}
        subtitle="Explosión estelar del Universo VYRO"
        symbol="🌌"
      >
        <SoundPlayer soundKey="galaxy" />
      </VyroGiftFxStage>
    </GiftPresentationStage>
  );
}
"use client";

import type {
  GiftAnimationComponentProps,
} from "../types";

import GiftPresentationStage from "../common/GiftPresentationStage";
import SoundPlayer from "../common/SoundPlayer";
import VyroGiftFxStage from "../common/VyroGiftFxStage";

export default function HeartAnimation({
  gift,
}: GiftAnimationComponentProps) {
  return (
    <GiftPresentationStage>
      <VyroGiftFxStage
        theme="heart"
        title={gift.name}
        subtitle="Pulso de amor en VYRO LIVE"
        symbol="❤️"
      >
        <SoundPlayer soundKey="heart" />
      </VyroGiftFxStage>
    </GiftPresentationStage>
  );
}
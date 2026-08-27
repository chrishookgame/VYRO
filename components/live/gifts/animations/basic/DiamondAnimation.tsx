"use client";

import type {
  GiftAnimationComponentProps,
} from "../types";

import GiftPresentationStage from "../common/GiftPresentationStage";
import SoundPlayer from "../common/SoundPlayer";
import VyroGiftFxStage from "../common/VyroGiftFxStage";

export default function DiamondAnimation({
  gift,
}: GiftAnimationComponentProps) {
  return (
    <GiftPresentationStage>
      <VyroGiftFxStage
        theme="diamond"
        title={gift.name}
        subtitle="Cristales de energía VYRO"
        symbol="💎"
      >
        <SoundPlayer soundKey="diamond" />
      </VyroGiftFxStage>
    </GiftPresentationStage>
  );
}
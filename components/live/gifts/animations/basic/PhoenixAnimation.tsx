"use client";

import type {
  GiftAnimationComponentProps,
} from "../types";

import GiftPresentationStage from "../common/GiftPresentationStage";
import SoundPlayer from "../common/SoundPlayer";
import VyroGiftFxStage from "../common/VyroGiftFxStage";

export default function PhoenixAnimation({
  gift,
}: GiftAnimationComponentProps) {
  return (
    <GiftPresentationStage>
      <VyroGiftFxStage
        theme="phoenix"
        title={gift.name}
        subtitle="Renacimiento de fuego VYRO"
        symbol="🔥"
      >
        <SoundPlayer soundKey="phoenix" />
      </VyroGiftFxStage>
    </GiftPresentationStage>
  );
}
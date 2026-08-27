"use client";

import type {
  GiftAnimationComponentProps,
} from "../types";

import GiftPresentationStage from "../common/GiftPresentationStage";
import SoundPlayer from "../common/SoundPlayer";
import VyroGiftFxStage from "../common/VyroGiftFxStage";

export default function VyroUniverseAnimation({
  gift,
}: GiftAnimationComponentProps) {
  return (
    <GiftPresentationStage>
      <VyroGiftFxStage
        theme="universe"
        title={gift.name}
        subtitle={`${gift.amount.toLocaleString("es-419")} VYRO · ⚡ +${gift.energyAdded.toLocaleString("es-419")}`}
        symbol="🪐"
      >
        <SoundPlayer
          soundKey="vyro_universe"
        />
      </VyroGiftFxStage>
    </GiftPresentationStage>
  );
}
"use client";

import type {
  GiftAnimationComponentProps,
} from "../types";

import GiftPresentationStage from "../common/GiftPresentationStage";
import SoundPlayer from "../common/SoundPlayer";
import VyroGiftFxStage from "../common/VyroGiftFxStage";

import {
  getGiftAnimationConfiguration,
} from "../configs";

export default function CrownAnimation({
  gift,
}: GiftAnimationComponentProps) {
  const config =
    getGiftAnimationConfiguration(
      gift.animationKey,
    );

  return (
    <GiftPresentationStage>
      <VyroGiftFxStage
        theme="crown"
        title={gift.name}
        subtitle={`${gift.amount.toLocaleString("es-419")} VYRO · ⚡ +${gift.energyAdded.toLocaleString("es-419")}`}
        symbol="👑"
      >
        <SoundPlayer
          soundKey={
            config.audio.soundKey
          }
        />
      </VyroGiftFxStage>
    </GiftPresentationStage>
  );
}
import {
  calculateGiftComboMultiplier,
} from "./GiftComboMultiplier";

import {
  calculateGiftAnalytics,
} from "./analytics/GiftAnalytics";

import {
  calculateAudienceExcitement,
} from "./audience/AudienceExcitement";

import {
  resolveLegendaryGiftChain,
} from "./chains/LegendaryGiftChain";

import {
  predictGiftMoment,
} from "./prediction/GiftPredictionAI";

import type {
  LiveGiftOverlayItem,
} from "@/hooks/useLiveGiftOverlay";

export function createAIGiftIntelligence(
  gift:LiveGiftOverlayItem,
  queuedGifts:number,
){
  const multiplier=
    calculateGiftComboMultiplier({
      rarity:gift.rarity,
      amount:gift.amount,
      energy:gift.energyAdded,
      queuedGifts,
    });

  const chain=
    resolveLegendaryGiftChain(
      gift.rarity,
      queuedGifts,
      gift.amount,
    );

  const excitement=
    calculateAudienceExcitement(
      gift.rarity,
      gift.amount,
      gift.energyAdded,
      queuedGifts,
      multiplier.multiplier,
    );

  const prediction=
    predictGiftMoment(
      gift.rarity,
      queuedGifts,
      excitement.score,
      chain.level,
    );

  const analytics=
    calculateGiftAnalytics(
      gift.amount,
      gift.creatorEarnings,
      gift.energyAdded,
      multiplier.multiplier,
      excitement.score,
    );

  return {
    multiplier,
    chain,
    excitement,
    prediction,
    analytics,
  };
}

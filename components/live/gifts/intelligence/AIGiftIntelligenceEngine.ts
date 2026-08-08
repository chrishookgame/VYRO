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

export interface AIGiftIntelligenceState {
  multiplier:
    ReturnType<
      typeof calculateGiftComboMultiplier
    >;

  chain:
    ReturnType<
      typeof resolveLegendaryGiftChain
    >;

  excitement:
    ReturnType<
      typeof calculateAudienceExcitement
    >;

  prediction:
    ReturnType<
      typeof predictGiftMoment
    >;

  analytics:
    ReturnType<
      typeof calculateGiftAnalytics
    >;
}

export function createAIGiftIntelligence(
  gift:LiveGiftOverlayItem,
  queuedGifts:number,
):AIGiftIntelligenceState{
  const multiplier=
    calculateGiftComboMultiplier({
      rarity:
        gift.rarity,

      amount:
        gift.amount,

      energy:
        gift.energyAdded,

      queuedGifts,
    });

  const chain=
    resolveLegendaryGiftChain({
      rarity:
        gift.rarity,

      queuedGifts,

      amount:
        gift.amount,
    });

  const excitement=
    calculateAudienceExcitement({
      rarity:
        gift.rarity,

      amount:
        gift.amount,

      energy:
        gift.energyAdded,

      queuedGifts,

      multiplier:
        multiplier.multiplier,
    });

  const prediction=
    predictGiftMoment({
      rarity:
        gift.rarity,

      queuedGifts,

      excitementScore:
        excitement.score,

      chainLevel:
        chain.level,
    });

  const analytics=
    calculateGiftAnalytics({
      amount:
        gift.amount,

      creatorEarnings:
        gift.creatorEarnings,

      energy:
        gift.energyAdded,

      multiplier:
        multiplier.multiplier,

      excitementScore:
        excitement.score,
    });

  return {
    multiplier,
    chain,
    excitement,
    prediction,
    analytics,
  };
}

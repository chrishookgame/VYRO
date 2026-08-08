import {
  createAudienceEmotionState,
} from "../emotion/AudienceEmotionNetwork";

import {
  createSpectacleOptimizerState,
} from "../optimizer/DynamicSpectacleOptimizer";

import {
  createCreatorPerformanceState,
} from "../performance/CreatorPerformanceIntelligence";

import {
  createLivePredictionState,
} from "../prediction/LivePredictionEngine";

import type {
  createGlobalSpectacleState,
} from "@/components/live/spectacle/GlobalSpectacleEngine";

import type {
  createGlobalUniverseDirectorState,
} from "@/components/live/universe/director/GlobalUniverseDirector";

export interface GlobalUniverseAIInput {
  spectacle:
    ReturnType<
      typeof createGlobalSpectacleState
    >;

  universe:
    ReturnType<
      typeof createGlobalUniverseDirectorState
    >;

  hypeScore:number;
  heatScore:number;

  creatorRank?:number;
  creatorScore?:number;
}

export function createGlobalUniverseAIState(
  input:GlobalUniverseAIInput,
){
  const emotion=
    createAudienceEmotionState({
      hypeScore:
        input.hypeScore,

      heatScore:
        input.heatScore,

      crowdPower:
        input.spectacle
          .crowd
          .crowdPower,

      momentum:
        input.universe
          .momentum
          .momentum,

      viral:
        input.spectacle
          .worldMoment,
    });

  const performance=
    createCreatorPerformanceState({
      rank:
        input.creatorRank,

      score:
        input.creatorScore,

      legacyScore:
        input.universe
          .legacy
          .legacyScore,

      spotlightAmplification:
        input.spectacle
          .spotlight
          .amplification,
    });

  const prediction=
    createLivePredictionState({
      atmosphereIntensity:
        input.spectacle
          .atmosphere
          .intensity,

      momentum:
        input.universe
          .momentum
          .momentum,

      arenaEvolution:
        input.universe
          .arena
          .evolution,

      emotionScore:
        emotion.score,

      performanceScore:
        performance
          .intelligenceScore,

      worldMoment:
        input.spectacle
          .worldMoment,
    });

  const optimizer=
    createSpectacleOptimizerState({
      predictionProbability:
        prediction.probability,

      emotionScore:
        emotion.score,

      creatorPerformance:
        performance
          .intelligenceScore,

      worldMoment:
        input.spectacle
          .worldMoment,
    });

  return {
    emotion,
    performance,
    prediction,
    optimizer,

    aiMode:
      prediction.prediction ===
        "LEGENDARY_MOMENT"
        ? "LEGENDARY_AI"
        : prediction.prediction ===
            "WORLD_MOMENT"
          ? "WORLD_AI"
          : optimizer.mode ===
              "EPIC"
            ? "EPIC_AI"
            : "ADAPTIVE_AI",
  } as const;
}

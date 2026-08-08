import {
  createAdaptiveSpectacleState,
} from "./adaptive/AdaptiveSpectacleController";

import {
  createDynamicCameraState,
} from "./camera/DynamicCameraDirector";

import {
  createAIEventDirectorState,
} from "./event/AIEventDirector";

import {
  createWorldExcitementState,
} from "./excitement/WorldExcitementEngine";

import {
  createLiveStorylineState,
} from "./storyline/LiveStorylineEngine";

import type {
  createGlobalSpectacleState,
} from "@/components/live/spectacle/GlobalSpectacleEngine";

import type {
  createGlobalUniverseDirectorState,
} from "@/components/live/universe/director/GlobalUniverseDirector";

import type {
  createGlobalUniverseAIState,
} from "@/components/live/universe/intelligence/director/GlobalUniverseAIDirector";

export interface GlobalLiveDirectorAIInput {
  spectacle:
    ReturnType<
      typeof createGlobalSpectacleState
    >;

  universe:
    ReturnType<
      typeof createGlobalUniverseDirectorState
    >;

  intelligence:
    ReturnType<
      typeof createGlobalUniverseAIState
    >;

  creatorName?:string;
  legendaryMoment:boolean;
}

export function createGlobalLiveDirectorAIState(
  input:GlobalLiveDirectorAIInput,
){
  const excitement=
    createWorldExcitementState({
      momentum:
        input.universe.momentum.momentum,

      emotionScore:
        input.intelligence.emotion.score,

      predictionProbability:
        input.intelligence.prediction.probability,

      atmosphereIntensity:
        input.spectacle.atmosphere.intensity,

      crowdPower:
        input.spectacle.crowd.crowdPower,
    });

  const eventDirector=
    createAIEventDirectorState({
      excitementScore:
        excitement.score,

      prediction:
        input.intelligence.prediction.prediction,

      worldMoment:
        input.spectacle.worldMoment,

      legendaryMoment:
        input.legendaryMoment,
    });

  const camera=
    createDynamicCameraState({
      excitementScore:
        excitement.score,

      predictionImminent:
        input.intelligence.prediction.imminent,

      worldMoment:
        input.spectacle.worldMoment,

      legendaryMoment:
        input.legendaryMoment,
    });

  const storyline=
    createLiveStorylineState({
      creatorName:
        input.creatorName,

      excitementScore:
        excitement.score,

      prediction:
        input.intelligence.prediction.prediction,

      universeLevel:
        input.universe.universeLevel,
    });

  const adaptive=
    createAdaptiveSpectacleState({
      excitementScore:
        excitement.score,

      predictionProbability:
        input.intelligence.prediction.probability,

      emotionScore:
        input.intelligence.emotion.score,
    });

  return {
    excitement,
    eventDirector,
    camera,
    storyline,
    adaptive,

    directorMode:
      eventDirector.priority === "CRITICAL"
        ? "WORLD_DIRECTOR"
        : eventDirector.priority === "HIGH"
          ? "EPIC_DIRECTOR"
          : adaptive.mode === "BOOST"
            ? "BOOST_DIRECTOR"
            : "SMART_DIRECTOR",
  } as const;
}

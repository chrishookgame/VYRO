import {
  createGlobalSpectacleState,
  type GlobalSpectacleInput,
} from "@/components/live/spectacle/GlobalSpectacleEngine";

import {
  createGlobalLiveDirectorAIState,
} from "@/components/live/directorai/GlobalLiveDirectorAI";

import {
  createGlobalLiveOrchestratorState,
} from "@/components/live/orchestrator/GlobalLiveOrchestrator";

import {
  createGlobalUniverseDirectorState,
} from "./director/GlobalUniverseDirector";

import {
  createGlobalUniverseAIState,
} from "./intelligence/director/GlobalUniverseAIDirector";

export type ReturnTypeGlobalSpectacle =
  ReturnType<
    typeof createGlobalSpectacleState
  >;

export type UniverseEngineInput =
  GlobalSpectacleInput;

export function createUniverseEngineState(
  input:UniverseEngineInput,
){
  const spectacle=
    createGlobalSpectacleState(
      input,
    );

  const universe=
    createGlobalUniverseDirectorState({
      spectacle,

      hypeScore:
        input.hypeScore,

      heatScore:
        input.globalEvents
          .heat
          .heat,

      creatorName:
        input.creatorName,

      creatorRank:
        input.creatorRank,

      creatorScore:
        input.creatorScore,

      legendaryMoment:
        input.legendaryMoment,
    });

  const intelligence=
    createGlobalUniverseAIState({
      spectacle,
      universe,

      hypeScore:
        input.hypeScore,

      heatScore:
        input.globalEvents
          .heat
          .heat,

      creatorRank:
        input.creatorRank,

      creatorScore:
        input.creatorScore,
    });

  const directorAI=
    createGlobalLiveDirectorAIState({
      spectacle,
      universe,
      intelligence,

      creatorName:
        input.creatorName,

      legendaryMoment:
        input.legendaryMoment,
    });

  const orchestrator=
    createGlobalLiveOrchestratorState({
      directorAI,
      universe,
    });

  return {
    spectacle,
    universe,
    intelligence,
    directorAI,
    orchestrator,
  };
}

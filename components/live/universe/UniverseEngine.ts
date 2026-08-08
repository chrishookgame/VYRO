import {
  createGlobalSpectacleState,
  type GlobalSpectacleInput,
} from "@/components/live/spectacle/GlobalSpectacleEngine";

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

  return {
    spectacle,
    universe,
    intelligence,
  };
}

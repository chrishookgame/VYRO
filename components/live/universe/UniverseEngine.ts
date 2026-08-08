import {
  createGlobalSpectacleState,
  type GlobalSpectacleInput,
} from "@/components/live/spectacle/GlobalSpectacleEngine";

import {
  createGlobalUniverseDirectorState,
} from "./director/GlobalUniverseDirector";

export type ReturnTypeGlobalSpectacle =
  ReturnType<
    typeof createGlobalSpectacleState
  >;

export interface UniverseEngineInput
  extends GlobalSpectacleInput {}

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
        input.globalEvents.heat.heat,

      creatorName:
        input.creatorName,

      creatorRank:
        input.creatorRank,

      creatorScore:
        input.creatorScore,

      legendaryMoment:
        input.legendaryMoment,
    });

  return {
    spectacle,
    universe,
  };
}

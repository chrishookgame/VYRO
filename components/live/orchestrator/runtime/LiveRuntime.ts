import type {
  LiveOrchestratorMode,
} from "../state/OrchestratorState";

export interface LiveRuntimeInput {
  excitementScore:number;
  worldMoment:boolean;
  cinematic:boolean;
}

export interface LiveRuntimeState {
  mode:LiveOrchestratorMode;

  intensity:number;

  cinematic:boolean;

  worldMoment:boolean;
}

export function createLiveRuntimeState(
  input:LiveRuntimeInput,
):LiveRuntimeState{
  const intensity=
    Math.min(
      100,
      Math.max(
        0,
        Math.round(
          input.excitementScore,
        ),
      ),
    );

  return {
    intensity,

    cinematic:
      input.cinematic,

    worldMoment:
      input.worldMoment,

    mode:
      input.worldMoment
        ? "WORLD"
        : input.cinematic
          ? "EPIC"
          : intensity >= 60
            ? "HYPE"
            : intensity >= 20
              ? "ACTIVE"
              : "IDLE",
  };
}

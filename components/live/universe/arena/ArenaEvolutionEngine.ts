export interface ArenaEvolutionInput {
  atmosphereIntensity:number;
  momentum:number;
  worldMoment:boolean;
}

export interface ArenaEvolutionState {
  evolution:number;

  stage:
    | "BASE"
    | "ENERGIZED"
    | "EPIC"
    | "WORLD"
    | "LEGENDARY";
}

export function createArenaEvolutionState(
  input:ArenaEvolutionInput,
):ArenaEvolutionState{
  const evolution=
    Math.min(
      100,
      Math.round(
        Math.max(0,input.atmosphereIntensity) * 0.55 +
        Math.max(0,input.momentum) * 0.35 +
        (input.worldMoment ? 10 : 0),
      ),
    );

  return {
    evolution,

    stage:
      evolution >= 92
        ? "LEGENDARY"
        : evolution >= 78
          ? "WORLD"
          : evolution >= 60
            ? "EPIC"
            : evolution >= 30
              ? "ENERGIZED"
              : "BASE",
  };
}

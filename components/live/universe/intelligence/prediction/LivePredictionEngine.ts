export interface LivePredictionInput {
  atmosphereIntensity:number;
  momentum:number;
  arenaEvolution:number;
  emotionScore:number;
  performanceScore:number;
  worldMoment:boolean;
}

export interface LivePredictionState {
  probability:number;

  prediction:
    | "STABLE"
    | "RISING_ACTION"
    | "MAJOR_MOMENT"
    | "WORLD_MOMENT"
    | "LEGENDARY_MOMENT";

  imminent:boolean;
}

export function createLivePredictionState(
  input:LivePredictionInput,
):LivePredictionState{
  const probability=
    Math.min(
      100,
      Math.round(
        Math.max(0,input.atmosphereIntensity) * 0.2 +
        Math.max(0,input.momentum) * 0.2 +
        Math.max(0,input.arenaEvolution) * 0.2 +
        Math.max(0,input.emotionScore) * 0.2 +
        Math.max(0,input.performanceScore) * 0.1 +
        (input.worldMoment ? 10 : 0),
      ),
    );

  return {
    probability,

    prediction:
      probability >= 92
        ? "LEGENDARY_MOMENT"
        : probability >= 80
          ? "WORLD_MOMENT"
          : probability >= 65
            ? "MAJOR_MOMENT"
            : probability >= 40
              ? "RISING_ACTION"
              : "STABLE",

    imminent:
      probability >= 65,
  };
}

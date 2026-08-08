export interface SpectacleOptimizerInput {
  predictionProbability:number;
  emotionScore:number;
  creatorPerformance:number;
  worldMoment:boolean;
}

export interface SpectacleOptimizerState {
  intensityBoost:number;
  visualScale:number;
  durationMultiplier:number;

  mode:
    | "BALANCED"
    | "AMPLIFIED"
    | "EPIC"
    | "MAXIMUM";
}

export function createSpectacleOptimizerState(
  input:SpectacleOptimizerInput,
):SpectacleOptimizerState{
  const intelligence=
    Math.min(
      100,
      Math.round(
        Math.max(0,input.predictionProbability) * 0.4 +
        Math.max(0,input.emotionScore) * 0.35 +
        Math.max(0,input.creatorPerformance) * 0.15 +
        (input.worldMoment ? 10 : 0),
      ),
    );

  return {
    intensityBoost:
      intelligence,

    visualScale:
      Number(
        (
          1 +
          intelligence /
          1000
        ).toFixed(3),
      ),

    durationMultiplier:
      Number(
        (
          1 +
          intelligence /
          500
        ).toFixed(2),
      ),

    mode:
      intelligence >= 90
        ? "MAXIMUM"
        : intelligence >= 75
          ? "EPIC"
          : intelligence >= 50
            ? "AMPLIFIED"
            : "BALANCED",
  };
}

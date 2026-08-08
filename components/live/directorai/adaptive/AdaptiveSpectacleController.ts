export interface AdaptiveSpectacleInput {
  excitementScore:number;
  predictionProbability:number;
  emotionScore:number;
}

export interface AdaptiveSpectacleState {
  intensity:number;

  mode:
    | "NORMAL"
    | "BOOST"
    | "EPIC"
    | "MAXIMUM";

  effectMultiplier:number;
  transitionMultiplier:number;
}

export function createAdaptiveSpectacleState(
  input:AdaptiveSpectacleInput,
):AdaptiveSpectacleState{
  const intensity=
    Math.min(
      100,
      Math.round(
        Math.max(0,input.excitementScore) * 0.4 +
        Math.max(0,input.predictionProbability) * 0.35 +
        Math.max(0,input.emotionScore) * 0.25,
      ),
    );

  return {
    intensity,

    mode:
      intensity >= 90
        ? "MAXIMUM"
        : intensity >= 75
          ? "EPIC"
          : intensity >= 50
            ? "BOOST"
            : "NORMAL",

    effectMultiplier:
      Number(
        (
          1 +
          intensity / 400
        ).toFixed(2),
      ),

    transitionMultiplier:
      Number(
        (
          1 +
          intensity / 600
        ).toFixed(2),
      ),
  };
}

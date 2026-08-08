export interface WorldExcitementInput {
  momentum:number;
  emotionScore:number;
  predictionProbability:number;
  atmosphereIntensity:number;
  crowdPower:number;
}

export interface WorldExcitementState {
  score:number;

  level:
    | "CALM"
    | "ACTIVE"
    | "HYPE"
    | "EPIC"
    | "WORLD";

  explosive:boolean;
}

export function createWorldExcitementState(
  input:WorldExcitementInput,
):WorldExcitementState{
  const score=
    Math.min(
      100,
      Math.round(
        Math.max(0,input.momentum) * 0.2 +
        Math.max(0,input.emotionScore) * 0.2 +
        Math.max(0,input.predictionProbability) * 0.25 +
        Math.max(0,input.atmosphereIntensity) * 0.2 +
        Math.max(0,input.crowdPower) * 0.15,
      ),
    );

  return {
    score,

    level:
      score >= 90
        ? "WORLD"
        : score >= 75
          ? "EPIC"
          : score >= 55
            ? "HYPE"
            : score >= 25
              ? "ACTIVE"
              : "CALM",

    explosive:
      score >= 80,
  };
}

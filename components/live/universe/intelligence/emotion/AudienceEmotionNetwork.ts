export interface AudienceEmotionInput {
  hypeScore:number;
  heatScore:number;
  crowdPower:number;
  momentum:number;
  viral:boolean;
}

export interface AudienceEmotionState {
  score:number;

  emotion:
    | "CALM"
    | "ENGAGED"
    | "EXCITED"
    | "EUPHORIC"
    | "FEVER";

  synchronization:number;
}

export function createAudienceEmotionState(
  input:AudienceEmotionInput,
):AudienceEmotionState{
  const score=
    Math.min(
      100,
      Math.round(
        Math.max(0,input.hypeScore) * 0.25 +
        Math.max(0,input.heatScore) * 0.2 +
        Math.max(0,input.crowdPower) * 0.2 +
        Math.max(0,input.momentum) * 0.25 +
        (input.viral ? 10 : 0),
      ),
    );

  return {
    score,

    emotion:
      score >= 90
        ? "FEVER"
        : score >= 75
          ? "EUPHORIC"
          : score >= 55
            ? "EXCITED"
            : score >= 25
              ? "ENGAGED"
              : "CALM",

    synchronization:
      Number(
        Math.min(
          1,
          score / 100,
        ).toFixed(2),
      ),
  };
}

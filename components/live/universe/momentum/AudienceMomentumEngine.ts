export interface AudienceMomentumInput {
  hypeScore:number;
  heatScore:number;
  crowdPower:number;
  viral:boolean;
}

export interface AudienceMomentumState {
  momentum:number;

  level:
    | "LOW"
    | "RISING"
    | "STRONG"
    | "EXTREME"
    | "UNSTOPPABLE";
}

export function createAudienceMomentumState(
  input:AudienceMomentumInput,
):AudienceMomentumState{
  const momentum=
    Math.min(
      100,
      Math.round(
        Math.max(0,input.hypeScore) * 0.35 +
        Math.max(0,input.heatScore) * 0.3 +
        Math.max(0,input.crowdPower) * 0.25 +
        (input.viral ? 10 : 0),
      ),
    );

  return {
    momentum,

    level:
      momentum >= 90
        ? "UNSTOPPABLE"
        : momentum >= 75
          ? "EXTREME"
          : momentum >= 55
            ? "STRONG"
            : momentum >= 25
              ? "RISING"
              : "LOW",
  };
}

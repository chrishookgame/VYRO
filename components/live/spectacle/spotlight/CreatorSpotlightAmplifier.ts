export interface CreatorSpotlightInput {
  creatorName?:string;
  rank?:number;
  score?:number;
  viral:boolean;
  legendaryMoment:boolean;
}

export interface CreatorSpotlightState {
  active:boolean;
  creatorName:string;
  amplification:number;

  level:
    | "NONE"
    | "FEATURED"
    | "ELITE"
    | "LEGENDARY";
}

export function createCreatorSpotlightState(
  input:CreatorSpotlightInput,
):CreatorSpotlightState{
  const rankBoost=
    input.rank === 1
      ? 25
      : input.rank && input.rank <= 3
        ? 15
        : 0;

  const amplification=
    Math.min(
      100,
      Math.round(
        Math.max(0,input.score ?? 0) * 0.02 +
        rankBoost +
        (input.viral ? 25 : 0) +
        (input.legendaryMoment ? 35 : 0),
      ),
    );

  return {
    active:
      amplification >= 30,

    creatorName:
      input.creatorName ??
      "",

    amplification,

    level:
      amplification >= 85
        ? "LEGENDARY"
        : amplification >= 60
          ? "ELITE"
          : amplification >= 30
            ? "FEATURED"
            : "NONE",
  };
}

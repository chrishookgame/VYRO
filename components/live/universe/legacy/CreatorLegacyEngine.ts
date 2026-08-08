export interface CreatorLegacyInput {
  creatorName?:string;
  creatorRank?:number;
  creatorScore?:number;
  legendaryMoment:boolean;
  worldMoment:boolean;
}

export interface CreatorLegacyState {
  creatorName:string;
  legacyScore:number;

  tier:
    | "RISING"
    | "ELITE"
    | "ICON"
    | "LEGEND"
    | "IMMORTAL";
}

export function createCreatorLegacyState(
  input:CreatorLegacyInput,
):CreatorLegacyState{
  const rankBoost=
    input.creatorRank === 1
      ? 25
      : input.creatorRank &&
        input.creatorRank <= 3
        ? 15
        : 0;

  const legacyScore=
    Math.min(
      100,
      Math.round(
        Math.max(0,input.creatorScore ?? 0) * 0.015 +
        rankBoost +
        (input.legendaryMoment ? 25 : 0) +
        (input.worldMoment ? 35 : 0),
      ),
    );

  return {
    creatorName:
      input.creatorName ??
      "",

    legacyScore,

    tier:
      legacyScore >= 92
        ? "IMMORTAL"
        : legacyScore >= 78
          ? "LEGEND"
          : legacyScore >= 60
            ? "ICON"
            : legacyScore >= 35
              ? "ELITE"
              : "RISING",
  };
}

export interface CreatorPerformanceInput {
  rank?:number;
  score?:number;
  legacyScore:number;
  spotlightAmplification:number;
}

export interface CreatorPerformanceState {
  intelligenceScore:number;

  level:
    | "DEVELOPING"
    | "STRONG"
    | "ELITE"
    | "DOMINANT"
    | "ICONIC";

  dominance:number;
}

export function createCreatorPerformanceState(
  input:CreatorPerformanceInput,
):CreatorPerformanceState{
  const rankBoost=
    input.rank === 1
      ? 25
      : input.rank &&
        input.rank <= 3
        ? 15
        : input.rank &&
          input.rank <= 10
          ? 8
          : 0;

  const intelligenceScore=
    Math.min(
      100,
      Math.round(
        Math.max(0,input.score ?? 0) * 0.015 +
        Math.max(0,input.legacyScore) * 0.3 +
        Math.max(0,input.spotlightAmplification) * 0.25 +
        rankBoost,
      ),
    );

  return {
    intelligenceScore,

    level:
      intelligenceScore >= 90
        ? "ICONIC"
        : intelligenceScore >= 75
          ? "DOMINANT"
          : intelligenceScore >= 55
            ? "ELITE"
            : intelligenceScore >= 30
              ? "STRONG"
              : "DEVELOPING",

    dominance:
      Number(
        (
          intelligenceScore /
          100
        ).toFixed(2),
      ),
  };
}

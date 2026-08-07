import type {
  CompetitiveTier,
} from "../types/CompetitiveCoreTypes";

export function resolveCompetitiveTier(
  power: number,
): CompetitiveTier {
  const safePower =
    Math.max(
      0,
      power,
    );

  if(safePower >= 100000){
    return "WORLD";
  }

  if(safePower >= 50000){
    return "LEGEND";
  }

  if(safePower >= 25000){
    return "MASTER";
  }

  if(safePower >= 10000){
    return "ELITE";
  }

  if(safePower >= 2500){
    return "CONTENDER";
  }

  return "ROOKIE";
}

export function createCompetitiveStatus(
  power: number,
) {
  const tier =
    resolveCompetitiveTier(
      power,
    );

  return {
    tier,

    worldQualified:
      tier === "WORLD",

    eliteQualified:
      tier === "WORLD" ||
      tier === "LEGEND" ||
      tier === "MASTER",
  };
}

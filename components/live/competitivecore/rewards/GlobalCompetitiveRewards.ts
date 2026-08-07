import type {
  CompetitiveTier,
} from "../types/CompetitiveCoreTypes";

const tierMultiplier:Record<
  CompetitiveTier,
  number
>={
  ROOKIE:1,
  CONTENDER:1.5,
  ELITE:2,
  MASTER:3,
  LEGEND:5,
  WORLD:10,
};

export function calculateGlobalCompetitiveRewards(
  tier: CompetitiveTier,
  placement: number,
  competitivePower: number,
) {
  const placementMultiplier =
    placement === 1
      ? 10
      : placement <= 3
        ? 5
        : placement <= 10
          ? 3
          : placement <= 100
            ? 2
            : 1;

  const multiplier =
    tierMultiplier[tier] *
    placementMultiplier;

  const safePower =
    Math.max(
      0,
      competitivePower,
    );

  return {
    coins:
      Math.round(
        safePower *
        multiplier,
      ),

    xp:
      Math.round(
        safePower *
        multiplier *
        2,
      ),

    worldChampion:
      placement === 1,

    globalElite:
      placement <= 10,

    premiumFrame:
      placement <= 100,
  };
}

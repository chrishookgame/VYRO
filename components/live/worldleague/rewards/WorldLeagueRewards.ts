import type {
  WorldLeagueDivision,
} from "../types/WorldLeagueTypes";

export function calculateWorldLeagueRewards(
  division: WorldLeagueDivision,
  position: number,
  leaguePoints: number,
) {
  const divisionMultiplier:Record<
    WorldLeagueDivision,
    number
  >={
    BRONZE:1,
    SILVER:1.5,
    GOLD:2,
    DIAMOND:3,
    ROYAL:5,
    INFINITY:10,
  };

  const placementMultiplier=
    position === 1
      ? 5
      : position <= 3
        ? 3
        : position <= 10
          ? 2
          : 1;

  const multiplier=
    divisionMultiplier[
      division
    ] *
    placementMultiplier;

  const safePoints=
    Math.max(
      0,
      leaguePoints,
    );

  return {
    coins:
      Math.round(
        safePoints *
        multiplier,
      ),

    xp:
      Math.round(
        safePoints *
        multiplier *
        2,
      ),

    championBadge:
      position === 1,

    eliteFrame:
      position <= 3,
  };
}

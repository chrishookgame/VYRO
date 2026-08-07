import type {
  WorldLeagueDivision,
} from "../types/WorldLeagueTypes";

const divisions:WorldLeagueDivision[]=[
  "BRONZE",
  "SILVER",
  "GOLD",
  "DIAMOND",
  "ROYAL",
  "INFINITY",
];

export function calculateLeagueMovement(
  division: WorldLeagueDivision,
  position: number,
  totalPlayers: number,
) {
  const index=
    divisions.indexOf(
      division,
    );

  const promotionLimit=
    Math.max(
      1,
      Math.ceil(
        totalPlayers * 0.1,
      ),
    );

  const relegationStart=
    Math.max(
      1,
      totalPlayers -
      Math.ceil(
        totalPlayers * 0.1,
      ) +
      1,
    );

  if(
    position <= promotionLimit &&
    index < divisions.length - 1
  ){
    return {
      action:"PROMOTION" as const,
      nextDivision:
        divisions[index+1],
    };
  }

  if(
    position >= relegationStart &&
    index > 0
  ){
    return {
      action:"RELEGATION" as const,
      nextDivision:
        divisions[index-1],
    };
  }

  return {
    action:"STAY" as const,
    nextDivision:
      division,
  };
}

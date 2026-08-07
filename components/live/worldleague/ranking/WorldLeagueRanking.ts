import type {
  WorldLeaguePlayer,
} from "../types/WorldLeagueTypes";

import {
  calculateWorldLeagueScore,
} from "../scoring/WorldLeagueScoring";

export function createWorldLeagueRanking(
  players: WorldLeaguePlayer[],
) {
  return players
    .map(
      player => ({
        ...player,

        calculatedScore:
          calculateWorldLeagueScore(
            player.circuitPoints,
            player.wins,
            player.losses,
            player.streak,
            player.championships,
          ),
      }),
    )
    .sort(
      (a,b) => {
        if(
          b.calculatedScore !==
          a.calculatedScore
        ){
          return (
            b.calculatedScore -
            a.calculatedScore
          );
        }

        if(
          b.championships !==
          a.championships
        ){
          return (
            b.championships -
            a.championships
          );
        }

        return (
          b.wins -
          a.wins
        );
      },
    )
    .map(
      (player,index) => ({
        ...player,

        worldLeagueRank:
          index + 1,
      }),
    );
}

import type {
  CompetitivePlayer,
} from "../types/CompetitiveCoreTypes";

import {
  calculateUnifiedCompetitivePower,
} from "../power/UnifiedCompetitivePower";

export function createUnifiedCompetitiveRanking(
  players: CompetitivePlayer[],
) {
  return players
    .map(
      player => ({
        ...player,

        competitivePower:
          calculateUnifiedCompetitivePower(
            player,
          ),
      }),
    )
    .sort(
      (a,b) => {
        if(
          b.competitivePower !==
          a.competitivePower
        ){
          return (
            b.competitivePower -
            a.competitivePower
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

        globalRank:
          index + 1,
      }),
    );
}

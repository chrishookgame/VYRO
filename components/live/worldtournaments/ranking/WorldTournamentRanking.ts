import type {
  WorldTournamentPlayer,
} from "../types/WorldTournamentTypes";

export function createWorldTournamentRanking(
  players: WorldTournamentPlayer[],
) {
  return [...players]
    .sort(
      (a,b) => {
        if(b.wins !== a.wins){
          return b.wins - a.wins;
        }

        if(b.score !== a.score){
          return b.score - a.score;
        }

        return a.losses - b.losses;
      },
    )
    .map(
      (player,index) => ({
        ...player,

        worldTournamentRank:
          index + 1,
      }),
    );
}

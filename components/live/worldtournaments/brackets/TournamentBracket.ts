import type {
  WorldTournamentPlayer,
} from "../types/WorldTournamentTypes";

export function createTournamentSeeds(
  players: WorldTournamentPlayer[],
) {
  return [...players]
    .sort(
      (a,b) =>
        b.score -
        a.score,
    )
    .map(
      (player,index) => ({
        ...player,

        seed:
          index + 1,
      }),
    );
}

export function createTournamentPairs(
  players: WorldTournamentPlayer[],
) {
  const seeded =
    createTournamentSeeds(
      players,
    );

  const pairs:{
    left:WorldTournamentPlayer;
    right:WorldTournamentPlayer;
  }[]=[];

  let leftIndex=0;
  let rightIndex=
    seeded.length - 1;

  while(leftIndex < rightIndex){
    pairs.push({
      left:seeded[leftIndex],
      right:seeded[rightIndex],
    });

    leftIndex++;
    rightIndex--;
  }

  return pairs;
}

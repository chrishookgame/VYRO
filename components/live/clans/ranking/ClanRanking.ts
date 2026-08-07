import type {
  VyroClan,
} from "../types";

export function createClanRanking(
  clans:VyroClan[],
) {
  return [...clans]
    .sort(
      (a,b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }

        if (b.wins !== a.wins) {
          return b.wins - a.wins;
        }

        return b.streak - a.streak;
      },
    )
    .map(
      (clan,index) => ({
        ...clan,
        rank:index + 1,
      }),
    );
}

import type {
  VyroClan,
} from "../types";

export function createClanLeaderboard(
  clans:VyroClan[],
) {
  return [...clans]
    .sort(
      (a,b) => {
        const aPower =
          a.score +
          a.wins * 100 +
          a.streak * 50;

        const bPower =
          b.score +
          b.wins * 100 +
          b.streak * 50;

        return bPower - aPower;
      },
    )
    .map(
      (clan,index) => ({
        ...clan,

        worldRank:
          index + 1,
      }),
    );
}

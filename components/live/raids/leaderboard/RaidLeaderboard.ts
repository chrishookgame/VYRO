import type {
  VyroRaidPlayer,
} from "@/components/live/wars/types";

export function createRaidLeaderboard(
  players: VyroRaidPlayer[],
) {
  return [...players]
    .sort(
      (a,b) => {
        const aPower =
          a.damage +
          a.support +
          a.victories * 500;

        const bPower =
          b.damage +
          b.support +
          b.victories * 500;

        return bPower - aPower;
      },
    )
    .map(
      (player,index) => ({
        ...player,
        rank:
          index + 1,
      }),
    );
}

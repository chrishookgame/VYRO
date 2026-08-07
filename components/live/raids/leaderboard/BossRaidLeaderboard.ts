import type {
  RaidPlayer,
} from "../types";

export function createBossRaidLeaderboard(
  players: RaidPlayer[],
) {
  return [...players]
    .sort(
      (a, b) =>
        b.damage -
        a.damage,
    )
    .map(
      (player, index) => ({
        ...player,

        rank:
          index + 1,

        mvp:
          index === 0,
      }),
    );
}

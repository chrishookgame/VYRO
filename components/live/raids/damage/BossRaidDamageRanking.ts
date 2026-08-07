import type {
  RaidPlayer,
} from "../types";

export function createBossRaidDamageRanking(
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
      }),
    );
}

export function calculateTotalRaidDamage(
  players: RaidPlayer[],
) {
  return players.reduce(
    (total, player) =>
      total +
      Math.max(
        0,
        player.damage,
      ),
    0,
  );
}

import type {
  VyroRaidBoss,
  VyroRaidPlayer,
} from "@/components/live/wars/types";

export function calculateRaid(
  boss: VyroRaidBoss,
  players: VyroRaidPlayer[],
) {
  const totalDamage =
    players.reduce(
      (total,player) =>
        total + player.damage,
      0,
    );

  const totalSupport =
    players.reduce(
      (total,player) =>
        total + player.support,
      0,
    );

  const remainingHealth =
    Math.max(
      0,
      boss.currentHealth -
      totalDamage,
    );

  const defeated =
    remainingHealth === 0;

  const mvp =
    [...players]
      .sort(
        (a,b) =>
          (
            b.damage +
            b.support
          ) -
          (
            a.damage +
            a.support
          ),
      )[0] ?? null;

  return {
    totalDamage,
    totalSupport,
    remainingHealth,
    defeated,
    mvp,
  };
}

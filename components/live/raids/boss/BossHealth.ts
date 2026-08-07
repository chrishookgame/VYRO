import type {
  RaidBoss,
} from "../types";

export function calculateBossHealth(
  boss: RaidBoss,
  incomingDamage: number,
): RaidBoss {
  const currentHealth =
    Math.max(
      0,
      boss.currentHealth -
      Math.max(
        0,
        incomingDamage,
      ),
    );

  return {
    ...boss,

    currentHealth,

    alive:
      currentHealth > 0,
  };
}

export function getBossHealthPercentage(
  boss: RaidBoss,
) {
  return Math.min(
    100,
    Math.max(
      0,
      Math.round(
        boss.currentHealth *
        100 /
        Math.max(
          boss.maxHealth,
          1,
        ),
      ),
    ),
  );
}

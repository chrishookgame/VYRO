import type {
  VyroRaidBoss,
} from "@/components/live/wars/types";

export function calculateBossState(
  boss: VyroRaidBoss,
) {
  const health =
    Math.max(
      0,
      boss.currentHealth,
    );

  const healthPercentage =
    Math.min(
      100,
      Math.round(
        health * 100 /
        Math.max(
          boss.maxHealth,
          1,
        ),
      ),
    );

  return {
    ...boss,

    currentHealth:
      health,

    healthPercentage,

    enraged:
      healthPercentage <= 25 &&
      health > 0,

    defeated:
      health === 0,
  };
}

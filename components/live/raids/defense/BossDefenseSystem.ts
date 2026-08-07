export interface BossDefenseState {
  shield: number;
  health: number;
  maxHealth: number;
  rage: boolean;
}

export function applyBossDefense(
  state: BossDefenseState,
  incomingDamage: number,
  regeneration: number,
) {
  const damage =
    Math.max(
      0,
      incomingDamage,
    );

  const shieldDamage =
    Math.min(
      state.shield,
      damage,
    );

  const remainingDamage =
    damage -
    shieldDamage;

  const shield =
    Math.max(
      0,
      state.shield -
      shieldDamage,
    );

  const healthAfterDamage =
    Math.max(
      0,
      state.health -
      remainingDamage,
    );

  const health =
    Math.min(
      state.maxHealth,
      healthAfterDamage +
      Math.max(
        0,
        regeneration,
      ),
    );

  const healthPercentage =
    health *
    100 /
    Math.max(
      state.maxHealth,
      1,
    );

  return {
    shield,
    health,

    rage:
      health > 0 &&
      healthPercentage <= 25,
  };
}

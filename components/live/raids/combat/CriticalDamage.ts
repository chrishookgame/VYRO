export interface CriticalDamageResult {
  damage: number;
  critical: boolean;
  multiplier: number;
}

export function calculateCriticalDamage(
  baseDamage: number,
  criticalChance: number,
  criticalMultiplier: number,
  roll: number,
): CriticalDamageResult {
  const safeDamage =
    Math.max(
      0,
      baseDamage,
    );

  const chance =
    Math.min(
      100,
      Math.max(
        0,
        criticalChance,
      ),
    );

  const multiplier =
    Math.max(
      1,
      criticalMultiplier,
    );

  const critical =
    roll >= 0 &&
    roll < chance;

  return {
    damage:
      Math.round(
        safeDamage *
        (
          critical
            ? multiplier
            : 1
        ),
      ),

    critical,
    multiplier:
      critical
        ? multiplier
        : 1,
  };
}

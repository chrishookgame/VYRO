export function calculateAllianceRewards(
  score: number,
  victory: boolean,
  streak: number,
) {
  const streakMultiplier =
    streak >= 20
      ? 3
      : streak >= 10
        ? 2
        : streak >= 5
          ? 1.5
          : 1;

  const victoryMultiplier =
    victory
      ? 2
      : 1;

  const safeScore =
    Math.max(
      0,
      score,
    );

  return {
    coins:
      Math.round(
        safeScore *
        streakMultiplier *
        victoryMultiplier,
      ),

    xp:
      Math.round(
        safeScore *
        2 *
        streakMultiplier *
        victoryMultiplier,
      ),

    allianceChest:
      victory,
  };
}

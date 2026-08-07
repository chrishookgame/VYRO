export function calculateGuildWarRewards(
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

  return {
    coins:
      Math.round(
        Math.max(
          0,
          score,
        ) *
        streakMultiplier *
        victoryMultiplier,
      ),

    xp:
      Math.round(
        Math.max(
          0,
          score,
        ) *
        2 *
        streakMultiplier *
        victoryMultiplier,
      ),

    victoryChest:
      victory,
  };
}

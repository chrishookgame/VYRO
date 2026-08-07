export function calculateGuildRaidRewards(
  contribution: number,
  victory: boolean,
  multiplier: number,
) {
  const safeContribution =
    Math.max(
      0,
      contribution,
    );

  const safeMultiplier =
    Math.max(
      1,
      multiplier,
    );

  const victoryMultiplier =
    victory
      ? 2
      : 1;

  return {
    coins:
      Math.round(
        safeContribution *
        safeMultiplier *
        victoryMultiplier,
      ),

    xp:
      Math.round(
        safeContribution *
        2 *
        safeMultiplier *
        victoryMultiplier,
      ),

    victoryChest:
      victory,
  };
}

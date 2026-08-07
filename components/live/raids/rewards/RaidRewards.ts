export function calculateRaidRewards(
  damage: number,
  support: number,
  defeatedBoss: boolean,
) {
  const contribution =
    Math.max(
      0,
      damage +
      support,
    );

  const victoryMultiplier =
    defeatedBoss
      ? 3
      : 1;

  return {
    coins:
      Math.round(
        contribution *
        victoryMultiplier,
      ),

    xp:
      Math.round(
        contribution *
        2 *
        victoryMultiplier,
      ),

    bossChest:
      defeatedBoss,

    legendaryDrop:
      defeatedBoss &&
      contribution >= 10000,
  };
}

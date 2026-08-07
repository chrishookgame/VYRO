export function calculateChampionshipRewards(
  placement: number,
  circuitPoints: number,
) {
  const safePoints =
    Math.max(
      0,
      circuitPoints,
    );

  const multiplier =
    placement === 1
      ? 20
      : placement === 2
        ? 10
        : placement === 3
          ? 7
          : placement <= 8
            ? 4
            : placement <= 32
              ? 2
              : 1;

  return {
    coins:
      Math.round(
        safePoints *
        multiplier,
      ),

    xp:
      Math.round(
        safePoints *
        3 *
        multiplier,
      ),

    worldCrown:
      placement === 1,

    legendaryFrame:
      placement <= 3,

    championshipBadge:
      placement <= 8,
  };
}

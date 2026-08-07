export function calculateTournamentRewards(
  placement: number,
  score: number,
) {
  const safeScore =
    Math.max(
      0,
      score,
    );

  const multiplier =
    placement === 1
      ? 10
      : placement === 2
        ? 5
        : placement <= 4
          ? 3
          : placement <= 16
            ? 2
            : 1;

  return {
    coins:
      Math.round(
        safeScore *
        multiplier,
      ),

    xp:
      Math.round(
        safeScore *
        2 *
        multiplier,
      ),

    worldChampion:
      placement === 1,

    finalist:
      placement <= 2,

    podium:
      placement <= 3,
  };
}

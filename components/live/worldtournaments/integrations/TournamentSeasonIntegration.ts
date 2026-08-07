export function calculateTournamentSeasonPoints(
  placement: number,
  wins: number,
  score: number,
) {
  const placementBonus =
    placement === 1
      ? 5000
      : placement === 2
        ? 3000
        : placement <= 4
          ? 1500
          : placement <= 16
            ? 500
            : 0;

  return (
    placementBonus +
    Math.max(
      0,
      wins,
    ) * 250 +
    Math.floor(
      Math.max(
        0,
        score,
      ) /
      100,
    )
  );
}

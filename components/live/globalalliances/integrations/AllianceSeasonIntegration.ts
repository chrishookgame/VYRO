export function calculateAllianceSeasonPoints(
  score: number,
  victory: boolean,
  streak: number,
) {
  return (
    Math.floor(
      Math.max(
        0,
        score,
      ) /
      100,
    ) +
    (
      victory
        ? 1500
        : 0
    ) +
    Math.max(
      0,
      streak,
    ) * 75
  );
}

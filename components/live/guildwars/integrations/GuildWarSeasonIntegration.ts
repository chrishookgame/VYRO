export function calculateGuildWarSeasonPoints(
  score: number,
  victory: boolean,
  streak: number,
) {
  return (
    Math.floor(
      Math.max(
        0,
        score,
      ) / 100
    ) +
    (
      victory
        ? 1000
        : 0
    ) +
    Math.max(
      0,
      streak,
    ) * 50
  );
}

export function calculateGuildWarScore(
  battlePoints: number,
  victories: number,
  streak: number,
) {
  return (
    Math.max(
      0,
      battlePoints,
    ) +
    Math.max(
      0,
      victories,
    ) * 1000 +
    Math.max(
      0,
      streak,
    ) * 250
  );
}

export function convertCircuitPointsToLeaguePoints(
  circuitPoints: number,
  championships: number,
) {
  return (
    Math.floor(
      Math.max(
        0,
        circuitPoints,
      ) /
      10,
    ) +
    Math.max(
      0,
      championships,
    ) * 1000
  );
}

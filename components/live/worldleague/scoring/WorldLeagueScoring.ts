export function calculateWorldLeagueScore(
  circuitPoints: number,
  wins: number,
  losses: number,
  streak: number,
  championships: number,
) {
  return Math.max(
    0,
    Math.round(
      Math.max(
        0,
        circuitPoints,
      ) +
      Math.max(
        0,
        wins,
      ) * 500 +
      Math.max(
        0,
        streak,
      ) * 250 +
      Math.max(
        0,
        championships,
      ) * 5000 -
      Math.max(
        0,
        losses,
      ) * 100,
    ),
  );
}

export function calculateClanStreak(
  current:number,
  won:boolean,
) {
  const streak =
    won
      ? current + 1
      : 0;

  return {
    streak,

    status:
      streak >= 20
        ? "LEGENDARY"
        : streak >= 10
          ? "EPIC"
          : streak >= 5
            ? "HOT"
            : "NORMAL",
  };
}

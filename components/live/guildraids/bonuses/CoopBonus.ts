export function calculateCoopBonus(
  members: number,
  streak: number,
) {
  const memberBonus =
    Math.min(
      2,
      Math.max(
        0,
        members,
      ) / 20,
    );

  const streakBonus =
    streak >= 20
      ? 2
      : streak >= 10
        ? 1
        : streak >= 5
          ? 0.5
          : 0;

  return {
    multiplier:
      1 +
      memberBonus +
      streakBonus,
  };
}

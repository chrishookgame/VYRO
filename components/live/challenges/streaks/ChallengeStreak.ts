export function calculateChallengeStreak(
  currentStreak: number,
  completed: boolean,
) {
  const nextStreak =
    completed
      ? currentStreak + 1
      : 0;

  const multiplier =
    nextStreak >= 30
      ? 5
      : nextStreak >= 14
        ? 3
        : nextStreak >= 7
          ? 2
          : 1;

  return {
    streak: nextStreak,
    multiplier,
  };
}

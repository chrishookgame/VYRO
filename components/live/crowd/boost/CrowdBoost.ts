export function calculateCrowdBoost(
  hype: number,
  supporterStreak: number,
) {
  let multiplier = 1;

  if (hype >= 90) {
    multiplier = 3;
  } else if (hype >= 70) {
    multiplier = 2;
  } else if (hype >= 50) {
    multiplier = 1.5;
  }

  const streakBonus =
    supporterStreak >= 30
      ? 1
      : supporterStreak >= 14
        ? 0.5
        : supporterStreak >= 7
          ? 0.25
          : 0;

  return {
    multiplier:
      multiplier +
      streakBonus,

    boostActive:
      multiplier > 1 ||
      streakBonus > 0,
  };
}

export function calculateComebackMode(
  scoreDifference: number,
  secondsRemaining: number,
  hype: number,
) {
  const active =
    secondsRemaining <= 30 &&
    scoreDifference <= 500 &&
    hype >= 60;

  return {
    active,

    intensity:
      active && hype >= 90
        ? "LEGENDARY"
        : active && hype >= 75
          ? "EPIC"
          : active
            ? "ACTIVE"
            : "OFF",

    finalSeconds:
      secondsRemaining <= 10,
  };
}

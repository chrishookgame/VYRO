export function calculateTeamSupport(
  leftSupport: number,
  rightSupport: number,
) {
  const total =
    Math.max(
      1,
      leftSupport +
      rightSupport,
    );

  const leftPercentage =
    Math.round(
      leftSupport * 100 /
      total,
    );

  return {
    leftPercentage,

    rightPercentage:
      100 - leftPercentage,

    leader:
      leftSupport === rightSupport
        ? "TIE"
        : leftSupport > rightSupport
          ? "LEFT"
          : "RIGHT",
  };
}

export function calculateCircuitSeasonBonus(
  placement: number,
  victories: number,
  championshipWon: boolean,
) {
  const placementBonus =
    placement === 1
      ? 10000
      : placement === 2
        ? 5000
        : placement === 3
          ? 3000
          : placement <= 8
            ? 1500
            : placement <= 32
              ? 500
              : 0;

  return (
    placementBonus +
    Math.max(
      0,
      victories,
    ) * 250 +
    (
      championshipWon
        ? 10000
        : 0
    )
  );
}

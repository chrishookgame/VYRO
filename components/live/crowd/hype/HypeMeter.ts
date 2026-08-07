export function calculateHypeMeter(
  reactions: number,
  viewers: number,
  supportPoints: number,
) {
  const raw =
    reactions * 4 +
    viewers +
    supportPoints * 2;

  const hype =
    Math.min(
      100,
      Math.max(
        0,
        Math.round(
          raw / 100,
        ),
      ),
    );

  return {
    hype,

    status:
      hype >= 90
        ? "LEGENDARY"
        : hype >= 70
          ? "EPIC"
          : hype >= 40
            ? "HOT"
            : "BUILDING",
  };
}

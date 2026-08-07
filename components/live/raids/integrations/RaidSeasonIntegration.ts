export function calculateRaidSeasonPoints(
  damage: number,
  bossDefeated: boolean,
  mvp: boolean,
) {
  const basePoints =
    Math.floor(
      Math.max(
        0,
        damage,
      ) /
      100,
    );

  return (
    basePoints +
    (
      bossDefeated
        ? 1000
        : 0
    ) +
    (
      mvp
        ? 500
        : 0
    )
  );
}

export const AchievementLevels = {
  maxLevel: 100,
  eliteLevel: 75,
  legendLevel: 100,
};

export const VYRO_LIVE_LEVELS = [
  {
    minimumScore: 0,
    name: "VYRO SPARK",
  },
  {
    minimumScore: 120,
    name: "VYRO PULSE",
  },
  {
    minimumScore: 220,
    name: "VYRO NOVA",
  },
  {
    minimumScore: 350,
    name: "VYRO PRIME",
  },
  {
    minimumScore: 500,
    name: "VYRO TITAN",
  },
  {
    minimumScore: 700,
    name: "VYRO APEX",
  },
  {
    minimumScore: 900,
    name: "VYRO IMMORTAL",
  },
  {
    minimumScore: 1200,
    name: "VYRO INFINITY",
  },
] as const;

export function getVyroLiveLevelName(
  score: number,
): string {
  const safeScore =
    Math.max(
      0,
      Number.isFinite(score)
        ? score
        : 0,
    );

  for (
    let index =
      VYRO_LIVE_LEVELS.length - 1;
    index >= 0;
    index -= 1
  ) {
    const level =
      VYRO_LIVE_LEVELS[index];

    if (
      safeScore >=
      level.minimumScore
    ) {
      return level.name;
    }
  }

  return VYRO_LIVE_LEVELS[0].name;
}

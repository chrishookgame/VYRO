export const AchievementLevels = {
  maxLevel: 100,
  eliteLevel: 75,
  legendLevel: 100,
};

export type VyroLiveLevelIntensity =
  | "standard"
  | "epic"
  | "legendary";

export const VYRO_LIVE_LEVELS = [
  {
    minimumScore: 0,
    name: "VYRO SPARK",
    intensity: "standard",
    celebrates: false,
  },
  {
    minimumScore: 120,
    name: "VYRO PULSE",
    intensity: "standard",
    celebrates: true,
  },
  {
    minimumScore: 220,
    name: "VYRO NOVA",
    intensity: "standard",
    celebrates: true,
  },
  {
    minimumScore: 350,
    name: "VYRO PRIME",
    intensity: "standard",
    celebrates: true,
  },
  {
    minimumScore: 500,
    name: "VYRO TITAN",
    intensity: "epic",
    celebrates: true,
  },
  {
    minimumScore: 700,
    name: "VYRO APEX",
    intensity: "epic",
    celebrates: true,
  },
  {
    minimumScore: 900,
    name: "VYRO IMMORTAL",
    intensity: "legendary",
    celebrates: true,
  },
  {
    minimumScore: 1200,
    name: "VYRO INFINITY",
    intensity: "legendary",
    celebrates: true,
  },
] as const satisfies readonly {
  minimumScore: number;
  name: string;
  intensity: VyroLiveLevelIntensity;
  celebrates: boolean;
}[];

export type VyroLiveLevelDefinition =
  (typeof VYRO_LIVE_LEVELS)[number];

function normalizeVyroLiveScore(
  score: number,
): number {
  return Math.max(
    0,
    Number.isFinite(score)
      ? score
      : 0,
  );
}

export function getVyroLiveLevel(
  score: number,
): VyroLiveLevelDefinition {
  const safeScore =
    normalizeVyroLiveScore(score);

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
      return level;
    }
  }

  return VYRO_LIVE_LEVELS[0];
}

export function getVyroLiveLevelName(
  score: number,
): string {
  return getVyroLiveLevel(score).name;
}

import type {
  FusionIntensity,
} from "./types";

interface FusionIntensityRule {
  minimumCount: number;
  intensity: FusionIntensity;
}

const fusionIntensityRules: FusionIntensityRule[] = [
  {
    minimumCount: 1,
    intensity: "low",
  },
  {
    minimumCount: 5,
    intensity: "medium",
  },
  {
    minimumCount: 15,
    intensity: "high",
  },
  {
    minimumCount: 50,
    intensity: "extreme",
  },
];

export function getFusionIntensity(
  count: number,
): FusionIntensity {
  const safeCount = Math.max(
    Math.floor(count),
    1,
  );

  return (
    [...fusionIntensityRules]
      .reverse()
      .find(
        (rule) =>
          safeCount >=
          rule.minimumCount,
      )?.intensity ??
    "low"
  );
}

export function hasFusionIntensityChanged(
  previousCount: number,
  nextCount: number,
): boolean {
  return (
    getFusionIntensity(
      previousCount,
    ) !==
    getFusionIntensity(
      nextCount,
    )
  );
}

export function canFuseEvents(
  firstFusionKey: string,
  secondFusionKey: string,
): boolean {
  return (
    firstFusionKey.trim().length > 0 &&
    firstFusionKey === secondFusionKey
  );
}

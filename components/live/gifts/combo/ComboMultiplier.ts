import type {
  GiftComboProgress,
  GiftComboTier,
} from "./types";

interface ComboTierRule {
  minimumCount: number;
  tier: GiftComboTier;
  multiplier: number;
}

const comboTierRules: ComboTierRule[] = [
  {
    minimumCount: 1,
    tier: "starter",
    multiplier: 1,
  },
  {
    minimumCount: 5,
    tier: "boost",
    multiplier: 1.1,
  },
  {
    minimumCount: 10,
    tier: "super",
    multiplier: 1.25,
  },
  {
    minimumCount: 25,
    tier: "mega",
    multiplier: 1.5,
  },
  {
    minimumCount: 50,
    tier: "ultra",
    multiplier: 2,
  },
  {
    minimumCount: 100,
    tier: "mythic",
    multiplier: 3,
  },
];

export function getGiftComboProgress(
  count: number,
): GiftComboProgress {
  const safeCount = Math.max(
    Math.floor(count),
    1,
  );

  const currentRule =
    [...comboTierRules]
      .reverse()
      .find(
        (rule) =>
          safeCount >=
          rule.minimumCount,
      ) ??
    comboTierRules[0];

  const currentIndex =
    comboTierRules.findIndex(
      (rule) =>
        rule.tier ===
        currentRule.tier,
    );

  const nextRule =
    comboTierRules[
      currentIndex + 1
    ] ?? null;

  const progressToNextTier =
    nextRule
      ? Math.min(
          Math.max(
            (
              safeCount -
              currentRule.minimumCount
            ) /
              (
                nextRule.minimumCount -
                currentRule.minimumCount
              ),
            0,
          ),
          1,
        )
      : 1;

  return {
    count: safeCount,
    multiplier:
      currentRule.multiplier,
    tier: currentRule.tier,
    progressToNextTier,
    nextTierAt:
      nextRule?.minimumCount ??
      null,
  };
}

export function calculateComboValue(
  baseValue: number,
  count: number,
): number {
  const progress =
    getGiftComboProgress(count);

  return Number(
    (
      Math.max(baseValue, 0) *
      progress.multiplier
    ).toFixed(2),
  );
}

export function hasComboTierChanged(
  previousCount: number,
  nextCount: number,
): boolean {
  return (
    getGiftComboProgress(
      previousCount,
    ).tier !==
    getGiftComboProgress(
      nextCount,
    ).tier
  );
}

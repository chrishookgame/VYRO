export function calculateChallengeReward(
  baseCoins: number,
  baseXp: number,
  streakMultiplier: number,
) {
  const multiplier =
    Math.max(
      1,
      streakMultiplier,
    );

  return {
    coins:
      Math.round(
        baseCoins * multiplier,
      ),

    xp:
      Math.round(
        baseXp * multiplier,
      ),

    bonusUnlocked:
      multiplier > 1,
  };
}

export const ChallengeRewards = {
  exclusiveBadge: true,
  exclusiveFrame: true,
  seasonalBonus: true,
  worldEventBonus: true,
};

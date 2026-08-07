export function calculateContributionReward(
  playerContribution: number,
  totalContribution: number,
  rewardPool: number,
) {
  const player =
    Math.max(
      0,
      playerContribution,
    );

  const total =
    Math.max(
      1,
      totalContribution,
    );

  const pool =
    Math.max(
      0,
      rewardPool,
    );

  const contributionPercentage =
    Math.min(
      100,
      player *
      100 /
      total,
    );

  return {
    contributionPercentage,

    reward:
      Math.round(
        pool *
        contributionPercentage /
        100,
      ),
  };
}

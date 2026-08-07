export function calculateClanRewards(
  score:number,
  wins:number,
  streak:number,
) {
  const multiplier =
    streak >= 20
      ? 5
      : streak >= 10
        ? 3
        : streak >= 5
          ? 2
          : 1;

  return {
    coins:
      Math.round(
        (score + wins * 250) *
        multiplier,
      ),

    xp:
      Math.round(
        (score * 2 + wins * 500) *
        multiplier,
      ),

    legendaryReward:
      streak >= 20,
  };
}

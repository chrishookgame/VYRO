export function calculateChallengeProgress(
  progress: number,
  target: number,
) {
  const percentage =
    Math.min(
      100,
      Math.max(
        0,
        Math.round(
          progress * 100 /
          Math.max(
            target,
            1,
          ),
        ),
      ),
    );

  return {
    percentage,

    completed:
      progress >= target,

    remaining:
      Math.max(
        0,
        target - progress,
      ),
  };
}

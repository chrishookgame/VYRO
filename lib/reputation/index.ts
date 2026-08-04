export type Reputation = {
  score: number;
  stars: 1 | 2 | 3 | 4 | 5;
};

export function calculateReputation(
  xp: number,
  trustScore: number,
  completedCourses: number,
  referrals: number,
): Reputation {

  const rawScore =
    (xp * 0.0005) +
    (trustScore * 0.5) +
    (completedCourses * 2) +
    (referrals * 1);

  const score =
    Math.max(
      0,
      Math.min(
        Math.round(rawScore),
        100,
      ),
    );

  let stars:
    | 1
    | 2
    | 3
    | 4
    | 5 = 1;

  if (score >= 90) {
    stars = 5;
  } else if (score >= 75) {
    stars = 4;
  } else if (score >= 50) {
    stars = 3;
  } else if (score >= 25) {
    stars = 2;
  }

  return {
    score,
    stars,
  };
}

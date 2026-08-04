export type TrustScore = {
  score: number;
  level:
    | "Excellent"
    | "Good"
    | "Average"
    | "Risk";
};

export function calculateTrustScore(
  score: number,
): TrustScore {

  const safeScore =
    Math.max(
      0,
      Math.min(score, 100),
    );

  if (safeScore >= 90) {
    return {
      score: safeScore,
      level: "Excellent",
    };
  }

  if (safeScore >= 75) {
    return {
      score: safeScore,
      level: "Good",
    };
  }

  if (safeScore >= 50) {
    return {
      score: safeScore,
      level: "Average",
    };
  }

  return {
    score: safeScore,
    level: "Risk",
  };
}

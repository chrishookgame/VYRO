import type {
  VyroChallenge,
  VyroChallengeState,
} from "./types";

export function createChallengeState(
  challenges: VyroChallenge[],
): VyroChallengeState {
  const active =
    challenges.filter(
      challenge => challenge.active,
    ).length;

  const completed =
    challenges.filter(
      challenge => challenge.completed,
    ).length;

  const totalProgress =
    challenges.length === 0
      ? 0
      : Math.round(
          challenges.reduce(
            (total, challenge) => {
              const percentage =
                Math.min(
                  100,
                  Math.round(
                    challenge.progress * 100 /
                    Math.max(
                      challenge.target,
                      1,
                    ),
                  ),
                );

              return total + percentage;
            },
            0,
          ) /
          challenges.length,
        );

  return {
    challenges,
    active,
    completed,
    totalProgress,
  };
}

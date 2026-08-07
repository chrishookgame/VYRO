import type {
  VyroChallengeLeaderboardPlayer,
} from "../types";

export function createChallengeLeaderboard(
  players: VyroChallengeLeaderboardPlayer[],
) {
  return [...players]
    .sort(
      (a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }

        if (
          b.completedChallenges !==
          a.completedChallenges
        ) {
          return (
            b.completedChallenges -
            a.completedChallenges
          );
        }

        return b.streak - a.streak;
      },
    )
    .map(
      (player, index) => ({
        ...player,
        rank: index + 1,
      }),
    );
}

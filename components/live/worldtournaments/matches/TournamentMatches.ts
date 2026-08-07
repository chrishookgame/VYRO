import type {
  WorldTournamentPlayer,
} from "../types/WorldTournamentTypes";

export function calculateTournamentMatch(
  left: WorldTournamentPlayer,
  right: WorldTournamentPlayer,
) {
  const leftPower =
    left.score +
    left.wins * 500;

  const rightPower =
    right.score +
    right.wins * 500;

  const total =
    Math.max(
      1,
      leftPower +
      rightPower,
    );

  const leftProbability =
    Math.round(
      leftPower *
      100 /
      total,
    );

  return {
    leftPower,
    rightPower,

    leftProbability,

    rightProbability:
      100 -
      leftProbability,

    favoriteId:
      leftPower >= rightPower
        ? left.creatorId
        : right.creatorId,
  };
}

import type {
  VyroWarTeam,
} from "../types";

export function calculateGuildWar(
  left: VyroWarTeam,
  right: VyroWarTeam,
) {
  const leftPower =
    left.score +
    left.wins * 150 +
    left.streak * 75 +
    left.members * 20;

  const rightPower =
    right.score +
    right.wins * 150 +
    right.streak * 75 +
    right.members * 20;

  const total =
    Math.max(
      1,
      leftPower + rightPower,
    );

  const leftProbability =
    Math.round(
      leftPower * 100 /
      total,
    );

  return {
    leftPower,
    rightPower,

    leftProbability,

    rightProbability:
      100 - leftProbability,

    favoriteId:
      leftPower >= rightPower
        ? left.id
        : right.id,
  };
}

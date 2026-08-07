import type {
  VyroClan,
} from "../types";

export function calculateClanBattle(
  left:VyroClan,
  right:VyroClan,
) {
  const leftPower =
    left.score +
    left.wins * 100 +
    left.streak * 50;

  const rightPower =
    right.score +
    right.wins * 100 +
    right.streak * 50;

  const total =
    Math.max(
      1,
      leftPower + rightPower,
    );

  const leftProbability =
    Math.round(
      leftPower * 100 / total,
    );

  return {
    leftProbability,

    rightProbability:
      100 - leftProbability,

    winnerId:
      leftPower >= rightPower
        ? left.id
        : right.id,
  };
}

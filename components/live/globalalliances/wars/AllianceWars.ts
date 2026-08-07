import type {
  GlobalAlliance,
} from "../types/GlobalAllianceTypes";

import {
  calculateAlliancePower,
} from "../power/AlliancePower";

export function calculateAllianceWar(
  left: GlobalAlliance,
  right: GlobalAlliance,
) {
  const leftPower =
    calculateAlliancePower(
      left,
    ).power;

  const rightPower =
    calculateAlliancePower(
      right,
    ).power;

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
        ? left.allianceId
        : right.allianceId,
  };
}

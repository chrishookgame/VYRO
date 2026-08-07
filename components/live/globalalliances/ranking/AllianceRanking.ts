import type {
  GlobalAlliance,
} from "../types/GlobalAllianceTypes";

import {
  calculateAlliancePower,
} from "../power/AlliancePower";

export function createAllianceRanking(
  alliances: GlobalAlliance[],
) {
  return alliances
    .map(
      alliance => ({
        ...alliance,

        calculatedPower:
          calculateAlliancePower(
            alliance,
          ).power,
      }),
    )
    .sort(
      (a,b) =>
        b.calculatedPower -
        a.calculatedPower,
    )
    .map(
      (alliance,index) => ({
        ...alliance,

        worldRank:
          index + 1,
      }),
    );
}

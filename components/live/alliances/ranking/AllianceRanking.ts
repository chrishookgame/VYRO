import {
  calculateAlliancePower,
} from "../AllianceEngine";

import type {
  VyroAlliance,
} from "@/components/live/wars/types";

export function createAllianceRanking(
  alliances: VyroAlliance[],
) {
  return alliances
    .map(
      alliance =>
        calculateAlliancePower(
          alliance,
        ),
    )
    .sort(
      (a,b) =>
        b.power - a.power,
    )
    .map(
      (alliance,index) => ({
        ...alliance,

        worldRank:
          index + 1,
      }),
    );
}

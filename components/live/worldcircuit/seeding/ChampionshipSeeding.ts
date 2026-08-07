import type {
  WorldCircuitCompetitor,
} from "../types/WorldCircuitTypes";

import {
  calculateGlobalCircuitPoints,
} from "../points/GlobalCircuitPoints";

export function createChampionshipSeeds(
  competitors: WorldCircuitCompetitor[],
) {
  return [...competitors]
    .sort(
      (a,b) =>
        calculateGlobalCircuitPoints(b) -
        calculateGlobalCircuitPoints(a),
    )
    .map(
      (competitor,index) => ({
        ...competitor,

        seed:
          index + 1,
      }),
    );
}

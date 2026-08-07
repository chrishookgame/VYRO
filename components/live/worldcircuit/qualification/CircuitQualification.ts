import type {
  WorldCircuitCompetitor,
} from "../types/WorldCircuitTypes";

import {
  calculateGlobalCircuitPoints,
} from "../points/GlobalCircuitPoints";

export function qualifyWorldCircuitPlayers(
  competitors: WorldCircuitCompetitor[],
  limit: number,
) {
  const safeLimit =
    Math.max(
      0,
      Math.floor(
        limit,
      ),
    );

  return [...competitors]
    .sort(
      (a,b) =>
        calculateGlobalCircuitPoints(b) -
        calculateGlobalCircuitPoints(a),
    )
    .slice(
      0,
      safeLimit,
    );
}

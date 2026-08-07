import type {
  CompetitivePlayer,
} from "../types/CompetitiveCoreTypes";

import {
  calculateUnifiedCompetitivePower,
} from "../power/UnifiedCompetitivePower";

export function qualifyCompetitivePlayers(
  players: CompetitivePlayer[],
  minimumPower: number,
  limit: number,
) {
  const safeMinimum =
    Math.max(
      0,
      minimumPower,
    );

  const safeLimit =
    Math.max(
      0,
      Math.floor(
        limit,
      ),
    );

  return players
    .filter(
      player =>
        calculateUnifiedCompetitivePower(
          player,
        ) >= safeMinimum,
    )
    .sort(
      (a,b) =>
        calculateUnifiedCompetitivePower(b) -
        calculateUnifiedCompetitivePower(a),
    )
    .slice(
      0,
      safeLimit,
    );
}

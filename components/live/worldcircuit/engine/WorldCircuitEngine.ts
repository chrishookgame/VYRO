import type {
  WorldCircuitCompetitor,
  WorldCircuitState,
} from "../types/WorldCircuitTypes";

export function createWorldCircuitState(
  season: number,
  competitors: WorldCircuitCompetitor[],
  qualified: number,
  championId: string | null,
  active: boolean,
): WorldCircuitState {
  return {
    season,
    competitors,
    qualified,
    championId,
    active,
  };
}

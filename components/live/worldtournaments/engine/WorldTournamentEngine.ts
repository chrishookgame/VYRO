import type {
  WorldTournamentMatch,
  WorldTournamentPlayer,
  WorldTournamentState,
} from "../types/WorldTournamentTypes";

export function createWorldTournamentState(
  tournamentId: string,
  season: number,
  players: WorldTournamentPlayer[],
  matches: WorldTournamentMatch[],
  championId: string | null,
  active: boolean,
): WorldTournamentState {
  return {
    tournamentId,
    season,
    players,
    matches,
    championId,
    active,
  };
}

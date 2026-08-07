import type {
  WorldLeaguePlayer,
  WorldLeagueState,
} from "../types/WorldLeagueTypes";

export function createWorldLeagueState(
  season: number,
  players: WorldLeaguePlayer[],
  active: boolean,
): WorldLeagueState {
  return {
    season,
    players,
    active,
  };
}

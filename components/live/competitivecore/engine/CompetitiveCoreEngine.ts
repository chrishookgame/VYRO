import type {
  CompetitiveCoreState,
  CompetitivePlayer,
} from "../types/CompetitiveCoreTypes";

export function createCompetitiveCoreState(
  season: number,
  players: CompetitivePlayer[],
  active: boolean,
  qualifiedPlayers: number,
): CompetitiveCoreState {
  return {
    season,
    players,
    active,

    qualifiedPlayers:
      Math.max(
        0,
        qualifiedPlayers,
      ),
  };
}

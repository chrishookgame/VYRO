export interface WorldTournamentPlayer {
  creatorId: string;
  creatorName: string;

  countryCode: string;

  score: number;
  wins: number;
  losses: number;

  seed: number;
  eliminated: boolean;
}

export interface WorldTournamentMatch {
  id: string;

  round: number;

  left: WorldTournamentPlayer | null;
  right: WorldTournamentPlayer | null;

  leftScore: number;
  rightScore: number;

  winnerId: string | null;

  finished: boolean;
}

export interface WorldTournamentState {
  tournamentId: string;

  season: number;

  players: WorldTournamentPlayer[];

  matches: WorldTournamentMatch[];

  championId: string | null;

  active: boolean;
}

export type PlayoffRound =
  | "ROUND_OF_16"
  | "QUARTERFINAL"
  | "SEMIFINAL"
  | "FINAL";

export interface PlayoffCompetitor {
  creatorId: string;
  creatorName: string;

  league: string;

  seed: number;

  score: number;
}

export interface PlayoffMatch {
  id: string;

  round: PlayoffRound;

  left: PlayoffCompetitor;
  right: PlayoffCompetitor;

  winnerId: string | null;

  finished: boolean;
}

export interface LeaguePlayoffState {
  season: number;

  round: PlayoffRound;

  matches: PlayoffMatch[];

  champion: PlayoffCompetitor | null;
}

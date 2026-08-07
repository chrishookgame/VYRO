export type CompetitiveLiveEventType =
  | "RANK_UP"
  | "WIN_STREAK"
  | "MILESTONE"
  | "CHAMPION"
  | "MVP"
  | "UPSET"
  | "QUALIFIED";

export interface LiveCompetitivePlayer {
  creatorId: string;
  creatorName: string;
  countryCode: string;

  rank: number;
  previousRank: number;

  competitivePower: number;

  wins: number;
  streak: number;

  championships: number;

  qualified: boolean;
}

export interface LiveCompetitiveEvent {
  id: string;

  type: CompetitiveLiveEventType;

  creatorId: string;
  creatorName: string;

  message: string;

  priority: number;

  createdAt: number;
}

export interface LiveCompetitiveState {
  players: LiveCompetitivePlayer[];

  events: LiveCompetitiveEvent[];

  hype: number;

  active: boolean;
}

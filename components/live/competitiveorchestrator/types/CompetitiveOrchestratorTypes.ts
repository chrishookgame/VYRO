export type OrchestratorEventType =
  | "RANK_UP"
  | "WIN_STREAK"
  | "CHAMPION"
  | "QUALIFIED"
  | "MVP"
  | "UPSET"
  | "MILESTONE";

export interface CompetitiveOrchestratorPlayer {
  creatorId: string;
  creatorName: string;

  rank: number;
  previousRank: number;

  wins: number;
  streak: number;

  championships: number;

  qualified: boolean;

  competitivePower: number;
}

export interface CompetitiveOrchestratorEvent {
  id: string;

  type: OrchestratorEventType;

  creatorId: string;
  creatorName: string;

  message: string;

  priority: number;

  createdAt: number;
}

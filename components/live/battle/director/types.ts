export type BattleDirectorInsightType =
  | "momentum"
  | "close_battle"
  | "dominance"
  | "comeback"
  | "draw_pressure"
  | "champion"
  | "status";

export type BattleDirectorInsightPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface BattleDirectorInsight {
  id: string;
  type: BattleDirectorInsightType;
  priority: BattleDirectorInsightPriority;
  title: string;
  message: string;
  createdAt: number;
}

export interface BattleDirectorState {
  mode:
    | "idle"
    | "watching"
    | "intense"
    | "finale";

  headline: string;
  summary: string;

  intensity: number;

  insights: BattleDirectorInsight[];
}

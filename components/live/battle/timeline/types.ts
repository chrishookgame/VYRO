export type BattleTimelineEventType =
  | "round_started"
  | "score_changed"
  | "round_draw"
  | "series_finished";

export interface BattleTimelineEvent {
  id: string;
  type: BattleTimelineEventType;
  title: string;
  description: string;
  createdAt: number;
}

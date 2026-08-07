export type BattleReplayMomentType =
  | "round"
  | "victory"
  | "draw"
  | "champion";

export interface BattleReplayMoment {
  id: string;
  type: BattleReplayMomentType;
  title: string;
  description: string;
  createdAt: number;
  durationMs: number;
}

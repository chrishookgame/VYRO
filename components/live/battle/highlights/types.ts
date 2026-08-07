export type BattleHighlightType =
  | "victory"
  | "draw"
  | "champion"
  | "moment";

export interface BattleHighlight {
  id: string;
  type: BattleHighlightType;
  title: string;
  description: string;
  createdAt: number;
  priority: number;
}

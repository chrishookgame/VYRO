export type BattleCelebrationFXMode =
  | "round"
  | "champion";

export interface BattleCelebrationFXState {
  visible: boolean;
  mode: BattleCelebrationFXMode;
  winnerName: string | null;
  celebrationId: string | null;
}

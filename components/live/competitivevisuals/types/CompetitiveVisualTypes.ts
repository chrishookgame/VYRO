export type CompetitiveVisualKind =
  | "NONE"
  | "RANK_UP"
  | "WIN_STREAK"
  | "CHAMPION"
  | "MVP"
  | "QUALIFIED"
  | "UPSET"
  | "MILESTONE";

export type CompetitiveVisualAnimation =
  | "NONE"
  | "SPARK"
  | "CONFETTI"
  | "FIREWORKS"
  | "CROWN";

export interface CompetitiveVisualEvent {
  id: string;

  kind: CompetitiveVisualKind;

  creatorId: string;
  creatorName: string;

  message: string;

  priority: number;

  animation: CompetitiveVisualAnimation;

  duration: number;

  spotlight: boolean;

  createdAt: number;
}

export interface CompetitiveVisualState {
  visible: boolean;

  primaryEvent: CompetitiveVisualEvent | null;

  queue: CompetitiveVisualEvent[];

  hype: number;
}

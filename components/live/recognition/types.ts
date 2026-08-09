export type LiveRecognitionKind =
  | "LEVEL_UP"
  | "WIN_STREAK"
  | "BATTLE_WINNER"
  | "CHAMPION"
  | "MILESTONE"
  | "SPOTLIGHT"
  | "HYPE";

export type LiveRecognitionIntensity =
  | "standard"
  | "epic"
  | "legendary";

export interface LiveRecognitionSignal {
  kind: LiveRecognitionKind;
  creatorId: string;
  creatorName: string;
  value?: number;
  label?: string;
  intensity?: LiveRecognitionIntensity;
  occurredAt?: number;
}

export interface LiveRecognitionMoment {
  id: string;
  kind: LiveRecognitionKind;
  creatorId: string;
  creatorName: string;
  title: string;
  message: string;
  intensity: LiveRecognitionIntensity;
  priority: number;
  durationMs: number;
  occurredAt: number;
}

export interface LiveRecognitionContext {
  now?: number;
  hypeScore?: number;
  competitiveIntensity?: number;
}

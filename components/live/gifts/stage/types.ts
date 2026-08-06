export type StageEventType =
  | "gift"
  | "combo"
  | "animation"
  | "platform";

export type StagePriorityLevel =
  | "low"
  | "normal"
  | "high"
  | "critical";

export interface StageEvent {
  id: string;
  type: StageEventType;
  priority: StagePriorityLevel;
  createdAt: number;
  durationMs: number;
  interruptible: boolean;
  payload: unknown;
}

export interface StageDirectorState {
  activeEvent: StageEvent | null;
  queue: StageEvent[];
  locked: boolean;
}

export interface StageSchedule {
  startedAt: number;
  endsAt: number;
  remainingMs: number;
}

export type PresentationEventType =
  | "WORLD_CHAMPION"
  | "CHAMPION"
  | "MVP"
  | "TOP_RANK"
  | "WIN_STREAK"
  | "SPOTLIGHT"
  | "BANNER";

export interface PresentationEvent {
  id: string;

  type: PresentationEventType;

  creatorId?: string;
  creatorName?: string;

  title: string;
  message?: string;

  createdAt: number;

  durationMs?: number;

  priorityBoost?: number;

  allowPreemption?: boolean;
}

export interface ScheduledPresentationEvent
  extends PresentationEvent {
  priority: number;
  durationMs: number;
}

export interface PresentationDirectorState {
  activeEvent:
    ScheduledPresentationEvent | null;

  queue:
    ScheduledPresentationEvent[];

  hasPendingEvents: boolean;
}

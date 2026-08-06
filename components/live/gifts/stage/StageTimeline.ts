import type {
  StageEvent,
  StageSchedule,
} from "./types";

export function createStageSchedule(
  event: StageEvent,
  startedAt = Date.now(),
): StageSchedule {
  const durationMs = Math.max(
    event.durationMs,
    0,
  );

  return {
    startedAt,
    endsAt:
      startedAt +
      durationMs,
    remainingMs: durationMs,
  };
}

export function getStageRemainingTime(
  schedule: StageSchedule,
  currentTime = Date.now(),
): number {
  return Math.max(
    schedule.endsAt -
      currentTime,
    0,
  );
}

export function hasStageScheduleFinished(
  schedule: StageSchedule,
  currentTime = Date.now(),
): boolean {
  return (
    getStageRemainingTime(
      schedule,
      currentTime,
    ) === 0
  );
}

export function refreshStageSchedule(
  event: StageEvent,
  currentTime = Date.now(),
): StageSchedule {
  return createStageSchedule(
    event,
    currentTime,
  );
}

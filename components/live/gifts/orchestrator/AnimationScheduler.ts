import type {
  AnimationQueueItem,
} from "./types";

export interface AnimationSchedule {
  startedAt: number;
  endsAt: number;
  remainingMs: number;
}

export function createAnimationSchedule(
  item: AnimationQueueItem,
  startedAt = Date.now(),
): AnimationSchedule {
  const durationMs = Math.max(
    item.durationMs,
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

export function getAnimationRemainingTime(
  schedule: AnimationSchedule,
  currentTime = Date.now(),
): number {
  return Math.max(
    schedule.endsAt -
      currentTime,
    0,
  );
}

export function hasAnimationFinished(
  schedule: AnimationSchedule,
  currentTime = Date.now(),
): boolean {
  return (
    getAnimationRemainingTime(
      schedule,
      currentTime,
    ) === 0
  );
}

export function selectNextScheduledAnimation(
  queue: AnimationQueueItem[],
): AnimationQueueItem | null {
  return queue[0] ?? null;
}

import type {
  ScheduledPresentationEvent,
} from "../types/PresentationEvent";

function normalizeSchedulerNow(
  now: number,
): number {
  return Number.isFinite(now)
    ? Math.max(0, now)
    : 0;
}

export function isPresentationEventExpired(
  event: ScheduledPresentationEvent,
  now: number,
): boolean {
  const normalizedNow =
    normalizeSchedulerNow(now);

  return (
    normalizedNow >=
    event.createdAt +
      event.durationMs
  );
}

export function getSchedulablePresentationEvents(
  queue: ScheduledPresentationEvent[],
  now?: number,
): ScheduledPresentationEvent[] {
  if (
    now === undefined
  ) {
    return [...queue];
  }

  const normalizedNow =
    normalizeSchedulerNow(now);

  return queue.filter(
    event =>
      !isPresentationEventExpired(
        event,
        normalizedNow,
      ),
  );
}

export function selectActivePresentationEvent(
  queue: ScheduledPresentationEvent[],
  now?: number,
): ScheduledPresentationEvent | null {
  return (
    getSchedulablePresentationEvents(
      queue,
      now,
    )[0] ??
    null
  );
}

export function getPendingPresentationEvents(
  queue: ScheduledPresentationEvent[],
  now?: number,
): ScheduledPresentationEvent[] {
  return getSchedulablePresentationEvents(
    queue,
    now,
  ).slice(1);
}

export function hasSchedulablePresentationEvents(
  queue: ScheduledPresentationEvent[],
  now?: number,
): boolean {
  return (
    getSchedulablePresentationEvents(
      queue,
      now,
    ).length > 0
  );
}

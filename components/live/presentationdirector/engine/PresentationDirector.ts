import {
  createPresentationQueue,
  deduplicatePresentationQueue,
} from "../queue/PresentationQueue";

import {
  getPendingPresentationEvents,
  getSchedulablePresentationEvents,
  selectActivePresentationEvent,
} from "../events/PresentationScheduler";

import type {
  PresentationDirectorState,
  PresentationEvent,
} from "../types/PresentationEvent";

function normalizeDirectorNow(
  now: number,
): number {
  return Number.isFinite(now)
    ? Math.max(0, now)
    : 0;
}

export function createPresentationDirectorState(
  events: PresentationEvent[],
  now?: number,
): PresentationDirectorState {
  const queue =
    deduplicatePresentationQueue(
      createPresentationQueue(
        events,
      ),
    );

  const normalizedNow =
    now === undefined
      ? undefined
      : normalizeDirectorNow(
          now,
        );

  const schedulableQueue =
    getSchedulablePresentationEvents(
      queue,
      normalizedNow,
    );

  const activeEvent =
    selectActivePresentationEvent(
      schedulableQueue,
    );

  const pending =
    getPendingPresentationEvents(
      schedulableQueue,
    );

  return {
    activeEvent,

    queue:
      schedulableQueue,

    hasPendingEvents:
      pending.length > 0,
  };
}

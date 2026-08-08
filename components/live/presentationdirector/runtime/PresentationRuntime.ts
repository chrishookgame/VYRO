import {
  advancePresentationTimeline,
  createPresentationTimelineState,
  preemptPresentationTimeline,
  type PresentationTimelineState,
} from "../timeline/PresentationTimeline";

import type {
  ScheduledPresentationEvent,
} from "../types/PresentationEvent";

export interface PresentationRuntimeState
  extends PresentationTimelineState {
  running: boolean;
}

function normalizeRuntimeNow(
  now: number,
): number {
  return Number.isFinite(now)
    ? Math.max(0, now)
    : 0;
}

function deriveRuntimeRunning(
  state: PresentationTimelineState,
): boolean {
  return (
    state.activeEvent !== null ||
    state.pendingEvents.length > 0
  );
}

function hasSamePendingEvents(
  current: ScheduledPresentationEvent[],
  next: ScheduledPresentationEvent[],
): boolean {
  return (
    current.length === next.length &&
    current.every(
      (
        event,
        index,
      ) =>
        event.id ===
        next[index]?.id,
    )
  );
}

export function createPresentationRuntime(
  queue: ScheduledPresentationEvent[],
  now: number,
): PresentationRuntimeState {
  const timeline =
    createPresentationTimelineState(
      queue,
      normalizeRuntimeNow(now),
    );

  return {
    ...timeline,

    running:
      deriveRuntimeRunning(
        timeline,
      ),
  };
}

export function tickPresentationRuntime(
  state: PresentationRuntimeState,
  now: number,
): PresentationRuntimeState {
  const timeline =
    advancePresentationTimeline(
      state,
      normalizeRuntimeNow(now),
    );

  return {
    ...timeline,

    running:
      deriveRuntimeRunning(
        timeline,
      ),
  };
}

export function preemptPresentationRuntime(
  state: PresentationRuntimeState,
  incomingEvent: ScheduledPresentationEvent,
  now: number,
): PresentationRuntimeState {
  const timeline =
    preemptPresentationTimeline(
      state,
      incomingEvent,
      normalizeRuntimeNow(now),
    );

  return {
    ...timeline,

    running:
      deriveRuntimeRunning(
        timeline,
      ),
  };
}

export function reconcilePresentationRuntime(
  state: PresentationRuntimeState,
  events: ScheduledPresentationEvent[],
): PresentationRuntimeState {
  const completed =
    new Set(
      state.completedEventIds,
    );

  const activeId =
    state.activeEvent?.id ??
    null;

  const seen =
    new Set<string>();

  const pendingEvents =
    events.filter(
      event => {
        if (
          event.id ===
          activeId
        ) {
          return false;
        }

        if (
          completed.has(
            event.id,
          )
        ) {
          return false;
        }

        if (
          seen.has(
            event.id,
          )
        ) {
          return false;
        }

        seen.add(
          event.id,
        );

        return true;
      },
    );

  const running =
    state.activeEvent !== null ||
    pendingEvents.length > 0;

  if (
    running === state.running &&
    hasSamePendingEvents(
      state.pendingEvents,
      pendingEvents,
    )
  ) {
    return state;
  }

  return {
    ...state,

    pendingEvents,

    running,
  };
}

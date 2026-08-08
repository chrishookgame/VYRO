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

  activeGapAfterMs: number;

  activeCinematicChain: boolean;

  activeNextEventId:
    string | null;

  executionContractLocked:
    boolean;
}

function normalizeRuntimeNow(
  now: number,
): number {
  return Number.isFinite(now)
    ? Math.max(0, now)
    : 0;
}

function normalizeRuntimeGap(
  gapAfterMs: number,
): number {
  return Number.isFinite(
    gapAfterMs,
  )
    ? Math.max(
        0,
        Math.round(
          gapAfterMs,
        ),
      )
    : 0;
}

function deriveRuntimeRunning(
  state: PresentationTimelineState,
): boolean {
  return (
    state.activeEvent !== null ||
    state.pendingEvents.length > 0 ||
    state.gapUntil !== null
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

function createEmptyExecutionContract() {
  return {
    activeGapAfterMs: 0,

    activeCinematicChain:
      false,

    activeNextEventId:
      null as string | null,

    executionContractLocked:
      false,
  };
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

    ...createEmptyExecutionContract(),
  };
}

export function lockPresentationRuntimeExecutionContract(
  state: PresentationRuntimeState,
  activeEventId: string,
  gapAfterMs: number,
  cinematicChain: boolean,
  nextEventId: string | null,
): PresentationRuntimeState {
  if (
    state.activeEvent?.id !==
    activeEventId
  ) {
    return state;
  }

  if (
    state.executionContractLocked
  ) {
    return state;
  }

  return {
    ...state,

    activeGapAfterMs:
      normalizeRuntimeGap(
        gapAfterMs,
      ),

    activeCinematicChain:
      cinematicChain,

    activeNextEventId:
      nextEventId,

    executionContractLocked:
      true,
  };
}

export function tickPresentationRuntime(
  state: PresentationRuntimeState,
  now: number,
): PresentationRuntimeState {
  const previousActiveId =
    state.activeEvent?.id ??
    null;

  const timeline =
    advancePresentationTimeline(
      state,
      normalizeRuntimeNow(now),
      state.activeGapAfterMs,
    );

  const nextActiveId =
    timeline.activeEvent?.id ??
    null;

  const activeChanged =
    previousActiveId !==
    nextActiveId;

  return {
    ...timeline,

    running:
      deriveRuntimeRunning(
        timeline,
      ),

    ...(activeChanged
      ? createEmptyExecutionContract()
      : {
          activeGapAfterMs:
            state.activeGapAfterMs,

          activeCinematicChain:
            state.activeCinematicChain,

          activeNextEventId:
            state.activeNextEventId,

          executionContractLocked:
            state.executionContractLocked,
        }),
  };
}

export function preemptPresentationRuntime(
  state: PresentationRuntimeState,
  incomingEvent: ScheduledPresentationEvent,
  now: number,
): PresentationRuntimeState {
  const previousActiveId =
    state.activeEvent?.id ??
    null;

  const timeline =
    preemptPresentationTimeline(
      state,
      incomingEvent,
      normalizeRuntimeNow(now),
    );

  const nextActiveId =
    timeline.activeEvent?.id ??
    null;

  const activeChanged =
    previousActiveId !==
    nextActiveId;

  return {
    ...timeline,

    running:
      deriveRuntimeRunning(
        timeline,
      ),

    ...(activeChanged
      ? createEmptyExecutionContract()
      : {
          activeGapAfterMs:
            state.activeGapAfterMs,

          activeCinematicChain:
            state.activeCinematicChain,

          activeNextEventId:
            state.activeNextEventId,

          executionContractLocked:
            state.executionContractLocked,
        }),
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
    pendingEvents.length > 0 ||
    state.gapUntil !== null;

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

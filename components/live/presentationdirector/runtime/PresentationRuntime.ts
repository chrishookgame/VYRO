import {
  advancePresentationTimeline,
  createPresentationTimelineState,
  preemptPresentationTimeline,
  type PresentationTimelineState,
} from "../timeline/PresentationTimeline";

import type {
  ScheduledPresentationEvent,
} from "../types/PresentationEvent";

export type PresentationRuntimePhase =
  | "IDLE"
  | "PLAYING"
  | "GAP";

export interface PresentationRuntimeState
  extends PresentationTimelineState {
  running: boolean;

  phase:
    PresentationRuntimePhase;

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
    ? Math.max(
        0,
        now,
      )
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

function deriveRuntimePhase(
  state: PresentationTimelineState,
): PresentationRuntimePhase {
  if (
    state.activeEvent
  ) {
    return "PLAYING";
  }

  if (
    state.gapUntil !== null
  ) {
    return "GAP";
  }

  return "IDLE";
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

function preserveExecutionContract(
  state: PresentationRuntimeState,
) {
  return {
    activeGapAfterMs:
      state.activeGapAfterMs,

    activeCinematicChain:
      state.activeCinematicChain,

    activeNextEventId:
      state.activeNextEventId,

    executionContractLocked:
      state.executionContractLocked,
  };
}

function prioritizeLockedNextEvent(
  state: PresentationRuntimeState,
  now: number,
): PresentationRuntimeState {
  if (
    state.activeEvent ||
    state.gapUntil === null ||
    now < state.gapUntil ||
    !state.activeNextEventId
  ) {
    return state;
  }

  const targetIndex =
    state.pendingEvents.findIndex(
      event =>
        event.id ===
        state.activeNextEventId,
    );

  if (
    targetIndex <= 0
  ) {
    return state;
  }

  const target =
    state.pendingEvents[
      targetIndex
    ];

  if (!target) {
    return state;
  }

  return {
    ...state,

    pendingEvents: [
      target,

      ...state.pendingEvents.filter(
        (
          _event,
          index,
        ) =>
          index !==
          targetIndex,
      ),
    ],
  };
}

export function shouldPreemptPresentationGap(
  state: PresentationRuntimeState,
  incomingEvent: ScheduledPresentationEvent,
): boolean {
  if (
    state.phase !== "GAP"
  ) {
    return false;
  }

  if (
    state.completedEventIds.includes(
      incomingEvent.id,
    )
  ) {
    return false;
  }

  if (
    incomingEvent.allowPreemption ===
      false
  ) {
    return false;
  }

  if (
    incomingEvent.id ===
      state.activeNextEventId
  ) {
    return false;
  }

  const lockedNextEvent =
    state.activeNextEventId
      ? state.pendingEvents.find(
          event =>
            event.id ===
            state.activeNextEventId,
        ) ??
        null
      : null;

  /*
   * If the locked next event disappeared,
   * allow the best eligible incoming event
   * to recover the runtime.
   */
  if (!lockedNextEvent) {
    return true;
  }

  return (
    incomingEvent.priority >
    lockedNextEvent.priority
  );
}
export function createPresentationRuntime(
  queue: ScheduledPresentationEvent[],
  now: number,
): PresentationRuntimeState {
  const timeline =
    createPresentationTimelineState(
      queue,
      normalizeRuntimeNow(
        now,
      ),
    );

  return {
    ...timeline,

    running:
      deriveRuntimeRunning(
        timeline,
      ),

    phase:
      deriveRuntimePhase(
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
  const normalizedNow =
    normalizeRuntimeNow(
      now,
    );

  const previousActiveId =
    state.activeEvent?.id ??
    null;

  const preparedState =
    prioritizeLockedNextEvent(
      state,
      normalizedNow,
    );

  const timeline =
    advancePresentationTimeline(
      preparedState,
      normalizedNow,
      preparedState.activeGapAfterMs,
    );

  const nextActiveId =
    timeline.activeEvent?.id ??
    null;

  const phase =
    deriveRuntimePhase(
      timeline,
    );

  /*
   * Contract lifecycle:
   *
   * PLAYING -> GAP
   * Preserve the contract.
   *
   * GAP -> PLAYING
   * The old transition is complete,
   * so the new event gets a fresh contract.
   *
   * PLAYING -> IDLE
   * Clear the contract.
   */
  const executionContract =
    phase === "GAP"
      ? preserveExecutionContract(
          preparedState,
        )
      : previousActiveId !==
          nextActiveId
        ? createEmptyExecutionContract()
        : preserveExecutionContract(
            preparedState,
          );

  return {
    ...timeline,

    running:
      deriveRuntimeRunning(
        timeline,
      ),

    phase,

    ...executionContract,
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
      normalizeRuntimeNow(
        now,
      ),
    );

  const nextActiveId =
    timeline.activeEvent?.id ??
    null;

  const phase =
    deriveRuntimePhase(
      timeline,
    );

  const activeChanged =
    previousActiveId !==
    nextActiveId;

  return {
    ...timeline,

    running:
      deriveRuntimeRunning(
        timeline,
      ),

    phase,

    ...(activeChanged
      ? createEmptyExecutionContract()
      : preserveExecutionContract(
          state,
        )),
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

  const phase =
    deriveRuntimePhase({
      ...state,
      pendingEvents,
    });

  if (
    running === state.running &&
    phase === state.phase &&
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

    phase,
  };
}

import type {
  ScheduledPresentationEvent,
} from "../types/PresentationEvent";

export interface PresentationTimelineState {
  activeEvent:
    ScheduledPresentationEvent | null;

  pendingEvents:
    ScheduledPresentationEvent[];

  activeSince:
    number | null;

  completedEventIds:
    string[];
}

function createCompletedEventSet(
  completedEventIds: string[],
): Set<string> {
  return new Set(
    completedEventIds,
  );
}

function filterCompletedEvents(
  events: ScheduledPresentationEvent[],
  completedEventIds: string[],
): ScheduledPresentationEvent[] {
  const completed =
    createCompletedEventSet(
      completedEventIds,
    );

  return events.filter(
    event =>
      !completed.has(
        event.id,
      ),
  );
}

function appendCompletedEventId(
  completedEventIds: string[],
  eventId: string,
): string[] {
  if (
    completedEventIds.includes(
      eventId,
    )
  ) {
    return completedEventIds;
  }

  return [
    ...completedEventIds,
    eventId,
  ];
}

export function createPresentationTimelineState(
  queue: ScheduledPresentationEvent[],
  now: number,
): PresentationTimelineState {
  const activeEvent =
    queue[0] ?? null;

  return {
    activeEvent,

    pendingEvents:
      queue.slice(1),

    activeSince:
      activeEvent
        ? now
        : null,

    completedEventIds: [],
  };
}

export function advancePresentationTimeline(
  state: PresentationTimelineState,
  now: number,
): PresentationTimelineState {
  const current =
    state.activeEvent;

  if (!current) {
    const eligiblePending =
      filterCompletedEvents(
        state.pendingEvents,
        state.completedEventIds,
      );

    const next =
      eligiblePending[0] ??
      null;

    return {
      activeEvent:
        next,

      pendingEvents:
        eligiblePending.slice(1),

      activeSince:
        next
          ? now
          : null,

      completedEventIds:
        state.completedEventIds,
    };
  }

  if (
    state.activeSince === null
  ) {
    return {
      ...state,

      activeSince:
        now,
    };
  }

  const elapsed =
    now -
    state.activeSince;

  if (
    elapsed <
    current.durationMs
  ) {
    return state;
  }

  const completedEventIds =
    appendCompletedEventId(
      state.completedEventIds,
      current.id,
    );

  const eligiblePending =
    filterCompletedEvents(
      state.pendingEvents,
      completedEventIds,
    );

  const next =
    eligiblePending[0] ??
    null;

  return {
    activeEvent:
      next,

    pendingEvents:
      eligiblePending.slice(1),

    activeSince:
      next
        ? now
        : null,

    completedEventIds,
  };
}

export function preemptPresentationTimeline(
  state: PresentationTimelineState,
  incomingEvent: ScheduledPresentationEvent,
  now: number,
): PresentationTimelineState {
  const current =
    state.activeEvent;

  if (
    state.completedEventIds.includes(
      incomingEvent.id,
    )
  ) {
    return state;
  }

  if (
    current &&
    current.id ===
      incomingEvent.id
  ) {
    return state;
  }

  const completed =
    createCompletedEventSet(
      state.completedEventIds,
    );

  const pendingWithoutIncoming =
    state.pendingEvents.filter(
      event =>
        event.id !==
          incomingEvent.id &&
        !completed.has(
          event.id,
        ),
    );

  const shouldReturnCurrent =
    current !== null &&
    !completed.has(
      current.id,
    );

  return {
    activeEvent:
      incomingEvent,

    pendingEvents:
      shouldReturnCurrent
        ? [
            current,
            ...pendingWithoutIncoming,
          ]
        : pendingWithoutIncoming,

    activeSince:
      now,

    completedEventIds:
      state.completedEventIds,
  };
}

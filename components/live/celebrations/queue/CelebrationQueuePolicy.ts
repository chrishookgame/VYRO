import type {
  VyroLiveCelebrationEvent,
} from "../types";

const MAX_CELEBRATION_QUEUE_SIZE =
  8;

const CELEBRATION_INTENSITY_PRIORITY = {
  standard: 100,
  epic: 200,
  legendary: 300,
} as const;

const CELEBRATION_TYPE_PRIORITY = {
  WIN_STREAK: 10,
  LEVEL_UP: 20,
  RECORD: 30,
  TITLE_GAINED: 40,
} as const;

export function getCelebrationPriority(
  event: VyroLiveCelebrationEvent,
): number {
  return (
    CELEBRATION_INTENSITY_PRIORITY[
      event.intensity
    ] +
    CELEBRATION_TYPE_PRIORITY[
      event.type
    ]
  );
}

export function compareCelebrationPriority(
  left: VyroLiveCelebrationEvent,
  right: VyroLiveCelebrationEvent,
): number {
  return (
    getCelebrationPriority(right) -
    getCelebrationPriority(left)
  );
}

export function orderCelebrationEvents(
  events: readonly VyroLiveCelebrationEvent[],
): VyroLiveCelebrationEvent[] {
  return events
    .map(
      (event, index) => ({
        event,
        index,
      }),
    )
    .sort(
      (left, right) =>
        compareCelebrationPriority(
          left.event,
          right.event,
        ) ||
        left.index -
          right.index,
    )
    .map(
      ({ event }) =>
        event,
    );
}

export function applyCelebrationQueuePolicy(
  events: readonly VyroLiveCelebrationEvent[],
): VyroLiveCelebrationEvent[] {
  return orderCelebrationEvents(
    events,
  ).slice(
    0,
    MAX_CELEBRATION_QUEUE_SIZE,
  );
}

export function mergeCelebrationQueue(
  currentQueue:
    readonly VyroLiveCelebrationEvent[],
  freshEvents:
    readonly VyroLiveCelebrationEvent[],
): VyroLiveCelebrationEvent[] {
  if (currentQueue.length === 0) {
    return applyCelebrationQueuePolicy(
      freshEvents,
    );
  }

  const [
    activeEvent,
    ...pendingEvents
  ] = currentQueue;

  const preemptingEvent =
    orderCelebrationEvents(
      freshEvents.filter(
        (event) =>
          event.intensity === "legendary" &&
          getCelebrationPriority(event) >
            getCelebrationPriority(activeEvent),
      ),
    )[0] ?? null;

  if (preemptingEvent) {
    const remainingFreshEvents =
      freshEvents.filter(
        (event) =>
          event.id !== preemptingEvent.id,
      );

    const prioritizedPending =
      orderCelebrationEvents([
        activeEvent,
        ...pendingEvents,
        ...remainingFreshEvents,
      ]).slice(
        0,
        MAX_CELEBRATION_QUEUE_SIZE - 1,
      );

    return [
      preemptingEvent,
      ...prioritizedPending,
    ];
  }

  const pendingCapacity =
    Math.max(
      0,
      MAX_CELEBRATION_QUEUE_SIZE - 1,
    );

  const prioritizedPending =
    orderCelebrationEvents([
      ...pendingEvents,
      ...freshEvents,
    ]).slice(
      0,
      pendingCapacity,
    );

  return [
    activeEvent,
    ...prioritizedPending,
  ];
}


export {
  MAX_CELEBRATION_QUEUE_SIZE,
};
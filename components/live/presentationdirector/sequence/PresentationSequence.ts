import type {
  PresentationEventType,
  ScheduledPresentationEvent,
} from "../types/PresentationEvent";

export interface PresentationSequenceItem {
  event: ScheduledPresentationEvent;

  index: number;

  previousType:
    PresentationEventType | null;

  nextType:
    PresentationEventType | null;

  nextEventId:
    string | null;

  gapAfterMs: number;

  cinematicChain: boolean;
}

export interface PresentationSequence {
  items: PresentationSequenceItem[];

  events:
    ScheduledPresentationEvent[];

  totalEventDurationMs: number;

  totalGapMs: number;

  totalDurationMs: number;
}

function getSequenceGapMs(
  current: ScheduledPresentationEvent,
  next: ScheduledPresentationEvent | null,
): number {
  if (!next) {
    return 0;
  }

  if (
    current.type ===
      "WORLD_CHAMPION" ||
    next.type ===
      "WORLD_CHAMPION"
  ) {
    return 500;
  }

  if (
    current.type ===
      "CHAMPION" ||
    next.type ===
      "CHAMPION"
  ) {
    return 400;
  }

  if (
    current.type ===
      "MVP" ||
    next.type ===
      "MVP"
  ) {
    return 300;
  }

  return 180;
}

function isCinematicChain(
  current: ScheduledPresentationEvent,
  next: ScheduledPresentationEvent | null,
): boolean {
  if (!next) {
    return false;
  }

  return (
    current.priority >= 70 &&
    next.priority >= 60
  );
}

export function buildPresentationSequence(
  queue: ScheduledPresentationEvent[],
): PresentationSequence {
  const ids =
    new Set<string>();

  const events =
    queue.filter(
      event => {
        if (
          ids.has(
            event.id,
          )
        ) {
          return false;
        }

        ids.add(
          event.id,
        );

        return true;
      },
    );

  const items =
    events.map(
      (
        event,
        index,
      ): PresentationSequenceItem => {
        const previous =
          events[index - 1] ??
          null;

        const next =
          events[index + 1] ??
          null;

        return {
          event,

          index,

          previousType:
            previous?.type ??
            null,

          nextType:
            next?.type ??
            null,

          nextEventId:
            next?.id ??
            null,

          gapAfterMs:
            getSequenceGapMs(
              event,
              next,
            ),

          cinematicChain:
            isCinematicChain(
              event,
              next,
            ),
        };
      },
    );

  const totalEventDurationMs =
    events.reduce(
      (
        total,
        event,
      ) =>
        total +
        event.durationMs,
      0,
    );

  const totalGapMs =
    items.reduce(
      (
        total,
        item,
      ) =>
        total +
        item.gapAfterMs,
      0,
    );

  return {
    items,

    events,

    totalEventDurationMs,

    totalGapMs,

    totalDurationMs:
      totalEventDurationMs +
      totalGapMs,
  };
}

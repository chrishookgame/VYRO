import {
  sortStageEventsByPriority,
} from "./StagePriority";

import type {
  StageEvent,
} from "./types";

export interface StageQueueResult {
  queue: StageEvent[];
  changed: boolean;
}

export function enqueueStageEvent(
  queue: StageEvent[],
  event: StageEvent,
): StageQueueResult {
  const alreadyExists =
    queue.some(
      (queueEvent) =>
        queueEvent.id === event.id,
    );

  if (alreadyExists) {
    return {
      queue,
      changed: false,
    };
  }

  return {
    queue:
      sortStageEventsByPriority([
        ...queue,
        event,
      ]),
    changed: true,
  };
}

export function dequeueStageEvent(
  queue: StageEvent[],
): {
  event: StageEvent | null;
  queue: StageEvent[];
} {
  const [
    nextEvent,
    ...remainingQueue
  ] = queue;

  return {
    event: nextEvent ?? null,
    queue: remainingQueue,
  };
}

export function removeStageEvent(
  queue: StageEvent[],
  eventId: string,
): StageQueueResult {
  const nextQueue =
    queue.filter(
      (event) =>
        event.id !== eventId,
    );

  return {
    queue: nextQueue,
    changed:
      nextQueue.length !==
      queue.length,
  };
}

export function clearStageEventQueue(): StageEvent[] {
  return [];
}

export function hasStageEvent(
  queue: StageEvent[],
  eventId: string,
): boolean {
  return queue.some(
    (event) =>
      event.id === eventId,
  );
}

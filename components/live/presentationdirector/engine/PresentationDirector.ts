import {
  createPresentationQueue,
  deduplicatePresentationQueue,
} from "../queue/PresentationQueue";

import {
  getPendingPresentationEvents,
  selectActivePresentationEvent,
} from "../events/PresentationScheduler";

import type {
  PresentationDirectorState,
  PresentationEvent,
} from "../types/PresentationEvent";

export function createPresentationDirectorState(
  events:PresentationEvent[],
):PresentationDirectorState{
  const queue=
    deduplicatePresentationQueue(
      createPresentationQueue(
        events,
      ),
    );

  const activeEvent=
    selectActivePresentationEvent(
      queue,
    );

  const pending=
    getPendingPresentationEvents(
      queue,
    );

  return {
    activeEvent,

    queue,

    hasPendingEvents:
      pending.length > 0,
  };
}

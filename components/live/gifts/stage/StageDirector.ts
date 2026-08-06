import {
  canInterruptStageEvent,
} from "./StagePriority";

import {
  dequeueStageEvent,
  enqueueStageEvent,
  hasStageEvent,
} from "./StageEventQueue";

import type {
  StageDirectorState,
  StageEvent,
} from "./types";

export interface StageDirectorUpdate {
  state: StageDirectorState;
  activated: boolean;
  interrupted: boolean;
  queued: boolean;
}

export function createStageDirectorState(): StageDirectorState {
  return {
    activeEvent: null,
    queue: [],
    locked: false,
  };
}

function containsStageEvent(
  state: StageDirectorState,
  eventId: string,
): boolean {
  return (
    state.activeEvent?.id === eventId ||
    hasStageEvent(
      state.queue,
      eventId,
    )
  );
}

export function submitStageEvent(
  state: StageDirectorState,
  incomingEvent: StageEvent,
): StageDirectorUpdate {
  if (
    containsStageEvent(
      state,
      incomingEvent.id,
    )
  ) {
    return {
      state,
      activated: false,
      interrupted: false,
      queued: false,
    };
  }

  if (!state.activeEvent) {
    return {
      state: {
        ...state,
        activeEvent: incomingEvent,
      },
      activated: true,
      interrupted: false,
      queued: false,
    };
  }

  if (
    !state.locked &&
    canInterruptStageEvent(
      state.activeEvent,
      incomingEvent,
    )
  ) {
    const queuedCurrent =
      enqueueStageEvent(
        state.queue,
        state.activeEvent,
      );

    return {
      state: {
        ...state,
        activeEvent: incomingEvent,
        queue: queuedCurrent.queue,
      },
      activated: true,
      interrupted: true,
      queued: false,
    };
  }

  const queuedIncoming =
    enqueueStageEvent(
      state.queue,
      incomingEvent,
    );

  return {
    state: {
      ...state,
      queue: queuedIncoming.queue,
    },
    activated: false,
    interrupted: false,
    queued:
      queuedIncoming.changed,
  };
}

export function completeActiveStageEvent(
  state: StageDirectorState,
): StageDirectorState {
  const next =
    dequeueStageEvent(
      state.queue,
    );

  return {
    ...state,
    activeEvent:
      next.event,
    queue:
      next.queue,
  };
}

export function lockStageDirector(
  state: StageDirectorState,
): StageDirectorState {
  return {
    ...state,
    locked: true,
  };
}

export function unlockStageDirector(
  state: StageDirectorState,
): StageDirectorState {
  return {
    ...state,
    locked: false,
  };
}

export function resetStageDirector(): StageDirectorState {
  return createStageDirectorState();
}

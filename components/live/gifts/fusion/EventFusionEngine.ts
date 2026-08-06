import {
  updateFusedEvent,
} from "./FusionManager";

import {
  defaultFusionConfiguration,
  isFusedEventExpired,
} from "./FusionWindow";

import type {
  FusedEvent,
  FusionConfiguration,
  FusionSourceEvent,
  FusionUpdateResult,
} from "./types";

export interface EventFusionEngineState {
  events: Record<
    string,
    FusedEvent
  >;
}

export function createEventFusionEngineState(): EventFusionEngineState {
  return {
    events: {},
  };
}

export function processFusionEvent(
  state: EventFusionEngineState,
  sourceEvent: FusionSourceEvent,
  configuration: FusionConfiguration =
    defaultFusionConfiguration,
  currentTime = Date.now(),
): {
  state: EventFusionEngineState;
  result: FusionUpdateResult;
} {
  const currentEvent =
    state.events[
      sourceEvent.fusionKey
    ] ?? null;

  const result =
    updateFusedEvent(
      currentEvent,
      sourceEvent,
      configuration,
      currentTime,
    );

  return {
    state: {
      events: {
        ...state.events,
        [sourceEvent.fusionKey]:
          result.fusedEvent,
      },
    },
    result,
  };
}

export function removeExpiredFusionEvents(
  state: EventFusionEngineState,
  currentTime = Date.now(),
): EventFusionEngineState {
  const activeEvents =
    Object.entries(
      state.events,
    ).filter(
      ([, fusedEvent]) =>
        !isFusedEventExpired(
          fusedEvent,
          currentTime,
        ),
    );

  return {
    events:
      Object.fromEntries(
        activeEvents,
      ),
  };
}

export function clearEventFusionEngine(): EventFusionEngineState {
  return createEventFusionEngineState();
}

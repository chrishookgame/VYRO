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

export function createPresentationTimelineState(
  queue:ScheduledPresentationEvent[],
  now:number,
):PresentationTimelineState{
  const activeEvent=
    queue[0] ?? null;

  return {
    activeEvent,

    pendingEvents:
      queue.slice(1),

    activeSince:
      activeEvent
        ? now
        : null,

    completedEventIds:
      [],
  };
}

export function advancePresentationTimeline(
  state:PresentationTimelineState,
  now:number,
):PresentationTimelineState{
  const current=
    state.activeEvent;

  if(!current){
    const next=
      state.pendingEvents[0] ??
      null;

    return {
      activeEvent:
        next,

      pendingEvents:
        state.pendingEvents.slice(1),

      activeSince:
        next
          ? now
          : null,

      completedEventIds:
        state.completedEventIds,
    };
  }

  if(state.activeSince === null){
    return {
      ...state,

      activeSince:
        now,
    };
  }

  const elapsed=
    now -
    state.activeSince;

  if(elapsed < current.durationMs){
    return state;
  }

  const next=
    state.pendingEvents[0] ??
    null;

  return {
    activeEvent:
      next,

    pendingEvents:
      state.pendingEvents.slice(1),

    activeSince:
      next
        ? now
        : null,

    completedEventIds:[
      ...state.completedEventIds,
      current.id,
    ],
  };
}

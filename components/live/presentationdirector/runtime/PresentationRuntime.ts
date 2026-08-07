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
  running:boolean;
}

export function createPresentationRuntime(
  queue:ScheduledPresentationEvent[],
  now:number,
):PresentationRuntimeState{
  const timeline=
    createPresentationTimelineState(
      queue,
      now,
    );

  return {
    ...timeline,

    running:
      timeline.activeEvent !== null,
  };
}

export function tickPresentationRuntime(
  state:PresentationRuntimeState,
  now:number,
):PresentationRuntimeState{
  const timeline=
    advancePresentationTimeline(
      state,
      now,
    );

  return {
    ...timeline,

    running:
      timeline.activeEvent !== null,
  };
}

export function preemptPresentationRuntime(
  state:PresentationRuntimeState,
  incomingEvent:ScheduledPresentationEvent,
  now:number,
):PresentationRuntimeState{
  const timeline=
    preemptPresentationTimeline(
      state,
      incomingEvent,
      now,
    );

  return {
    ...timeline,

    running:true,
  };
}

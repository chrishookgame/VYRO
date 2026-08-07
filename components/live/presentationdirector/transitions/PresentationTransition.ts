import type {
  ScheduledPresentationEvent,
} from "../types/PresentationEvent";

export type PresentationTransitionPhase =
  | "IDLE"
  | "ENTER"
  | "VISIBLE"
  | "EXIT";

export interface PresentationTransitionState {
  event:
    ScheduledPresentationEvent | null;

  phase:
    PresentationTransitionPhase;

  phaseStartedAt:
    number | null;
}

export interface PresentationTransitionDurations {
  enterMs:number;
  exitMs:number;
}

export function createPresentationTransitionState(
  event:ScheduledPresentationEvent | null,
  now:number,
):PresentationTransitionState{
  if(!event){
    return {
      event:null,
      phase:"IDLE",
      phaseStartedAt:null,
    };
  }

  return {
    event,
    phase:"ENTER",
    phaseStartedAt:now,
  };
}

export function advancePresentationTransition(
  state:PresentationTransitionState,
  now:number,
  durations:PresentationTransitionDurations,
):PresentationTransitionState{
  if(
    !state.event ||
    state.phaseStartedAt === null
  ){
    return state;
  }

  const elapsed=
    now -
    state.phaseStartedAt;

  if(
    state.phase === "ENTER" &&
    elapsed >= durations.enterMs
  ){
    return {
      ...state,
      phase:"VISIBLE",
      phaseStartedAt:now,
    };
  }

  if(
    state.phase === "VISIBLE" &&
    elapsed >=
      Math.max(
        0,
        state.event.durationMs -
        durations.enterMs -
        durations.exitMs,
      )
  ){
    return {
      ...state,
      phase:"EXIT",
      phaseStartedAt:now,
    };
  }

  if(
    state.phase === "EXIT" &&
    elapsed >= durations.exitMs
  ){
    return {
      event:null,
      phase:"IDLE",
      phaseStartedAt:null,
    };
  }

  return state;
}

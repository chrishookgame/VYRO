import {
  getPresentationPriority,
} from "../priority/PresentationPriority";

import type {
  ScheduledPresentationEvent,
} from "../types/PresentationEvent";

export interface PresentationPreemptionDecision {
  shouldPreempt:boolean;

  activeEvent:
    ScheduledPresentationEvent | null;

  incomingEvent:
    ScheduledPresentationEvent | null;

  reason:
    | "NO_ACTIVE_EVENT"
    | "NO_INCOMING_EVENT"
    | "HIGHER_PRIORITY"
    | "SAME_OR_LOWER_PRIORITY";
}

export function shouldPreemptPresentation(
  activeEvent:
    ScheduledPresentationEvent | null,

  incomingEvent:
    ScheduledPresentationEvent | null,
):boolean{
  if(!incomingEvent){
    return false;
  }

  if(!activeEvent){
    return true;
  }

  return (
    getPresentationPriority(
      incomingEvent.type,
    ) >
    getPresentationPriority(
      activeEvent.type,
    )
  );
}

export function resolvePresentationPreemption(
  activeEvent:
    ScheduledPresentationEvent | null,

  incomingEvent:
    ScheduledPresentationEvent | null,
):PresentationPreemptionDecision{
  if(!incomingEvent){
    return {
      shouldPreempt:false,
      activeEvent,
      incomingEvent:null,
      reason:"NO_INCOMING_EVENT",
    };
  }

  if(!activeEvent){
    return {
      shouldPreempt:true,
      activeEvent:null,
      incomingEvent,
      reason:"NO_ACTIVE_EVENT",
    };
  }

  const shouldPreempt=
    shouldPreemptPresentation(
      activeEvent,
      incomingEvent,
    );

  return {
    shouldPreempt,
    activeEvent,
    incomingEvent,

    reason:
      shouldPreempt
        ? "HIGHER_PRIORITY"
        : "SAME_OR_LOWER_PRIORITY",
  };
}

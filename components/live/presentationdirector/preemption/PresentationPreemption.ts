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
    | "PREEMPTION_DISABLED"
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

  if(
    incomingEvent.allowPreemption ===
      false
  ){
    return false;
  }

  return (
    incomingEvent.priority >
    activeEvent.priority
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
      reason:
        "NO_INCOMING_EVENT",
    };
  }

  if(!activeEvent){
    return {
      shouldPreempt:true,
      activeEvent:null,
      incomingEvent,
      reason:
        "NO_ACTIVE_EVENT",
    };
  }

  if(
    incomingEvent.allowPreemption ===
      false
  ){
    return {
      shouldPreempt:false,
      activeEvent,
      incomingEvent,
      reason:
        "PREEMPTION_DISABLED",
    };
  }

  const shouldPreempt =
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

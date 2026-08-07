import {
  getPresentationPriority,
} from "../priority/PresentationPriority";

import type {
  PresentationEvent,
  ScheduledPresentationEvent,
} from "../types/PresentationEvent";

const DEFAULT_DURATION_MS=4000;

export function normalizePresentationEvent(
  event:PresentationEvent,
):ScheduledPresentationEvent{
  return {
    ...event,

    priority:
      getPresentationPriority(
        event.type,
      ),

    durationMs:
      Math.max(
        1000,
        event.durationMs ??
        DEFAULT_DURATION_MS,
      ),
  };
}

export function createPresentationQueue(
  events:PresentationEvent[],
):ScheduledPresentationEvent[]{
  return events
    .map(
      normalizePresentationEvent,
    )
    .sort(
      (a,b)=>{
        if(
          b.priority !==
          a.priority
        ){
          return (
            b.priority -
            a.priority
          );
        }

        return (
          a.createdAt -
          b.createdAt
        );
      },
    );
}

export function deduplicatePresentationQueue(
  events:ScheduledPresentationEvent[],
):ScheduledPresentationEvent[]{
  const ids=new Set<string>();

  return events.filter(
    event=>{
      if(ids.has(event.id)){
        return false;
      }

      ids.add(event.id);

      return true;
    },
  );
}

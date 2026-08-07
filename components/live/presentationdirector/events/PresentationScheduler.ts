import type {
  ScheduledPresentationEvent,
} from "../types/PresentationEvent";

export function selectActivePresentationEvent(
  queue:ScheduledPresentationEvent[],
):ScheduledPresentationEvent | null{
  return queue[0] ?? null;
}

export function getPendingPresentationEvents(
  queue:ScheduledPresentationEvent[],
):ScheduledPresentationEvent[]{
  return queue.slice(1);
}

export function isPresentationEventExpired(
  event:ScheduledPresentationEvent,
  now:number,
):boolean{
  return (
    now >=
    event.createdAt +
    event.durationMs
  );
}

import type {
  ScheduledPresentationEvent,
} from "../types/PresentationEvent";

export interface WorldChampionPresentation {
  event: ScheduledPresentationEvent;
  title: string;
  subtitle: string;
  cinematic: "WORLD_CHAMPION";
}

export function createWorldChampionPresentation(
  event: ScheduledPresentationEvent,
): WorldChampionPresentation {
  return {
    event,
    title: "WORLD CHAMPION",
    subtitle:
      event.creatorName ??
      "Unknown Champion",
    cinematic: "WORLD_CHAMPION",
  };
}

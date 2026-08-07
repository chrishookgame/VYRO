import type {
  PresentationEventType,
} from "../types/PresentationEvent";

const PRESENTATION_PRIORITY:Record<
  PresentationEventType,
  number
>={
  WORLD_CHAMPION:100,
  CHAMPION:90,
  MVP:80,
  TOP_RANK:70,
  WIN_STREAK:60,
  SPOTLIGHT:40,
  BANNER:20,
};

export function getPresentationPriority(
  type:PresentationEventType,
):number{
  return PRESENTATION_PRIORITY[type];
}

export function comparePresentationPriority(
  a:PresentationEventType,
  b:PresentationEventType,
):number{
  return (
    getPresentationPriority(b) -
    getPresentationPriority(a)
  );
}

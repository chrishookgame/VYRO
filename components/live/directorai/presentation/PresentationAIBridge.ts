import type {
  PresentationEvent,
  PresentationEventType,
} from "@/components/live/presentationdirector/types/PresentationEvent";

import type {
  AIEventDirectorState,
} from "../event/AIEventDirector";

import type {
  LiveStorylineState,
} from "../storyline/LiveStorylineEngine";

export interface AIPresentationBridgeInput {
  director:AIEventDirectorState;
  storyline:LiveStorylineState;

  creatorId?:string;
  creatorName?:string;

  rank?:number;
  score?:number;

  createdAt:number;
}

export function createAIPresentationEvent(
  input:AIPresentationBridgeInput,
):PresentationEvent | null{
  if(
    !input.director.shouldPresent ||
    input.director.event === "NONE"
  ){
    return null;
  }

  const type:PresentationEventType=
    input.director.event;

  const durationMs=
    input.director.priority === "CRITICAL"
      ? 6000
      : input.director.priority === "HIGH"
        ? 4500
        : input.director.priority === "MEDIUM"
          ? 3200
          : 2500;

  return {
    id:
      `ai-live-${type}-${input.createdAt}`,

    type,

    creatorId:
      input.creatorId,

    creatorName:
      input.creatorName,

    rank:
      input.rank,

    score:
      input.score,

    title:
      input.storyline.title,

    message:
      input.storyline.message,

    createdAt:
      input.createdAt,

    durationMs,
  };
}

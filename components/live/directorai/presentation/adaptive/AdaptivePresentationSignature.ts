import type {
  AIEventDirectorState,
} from "../../event/AIEventDirector";

import type {
  LiveStorylineState,
} from "../../storyline/LiveStorylineEngine";

export interface AdaptivePresentationSignatureInput {
  director:AIEventDirectorState;

  storyline:LiveStorylineState;

  creatorId?:string;

  universeLevel:
    | "NORMAL"
    | "GLOBAL"
    | "WORLD"
    | "LEGENDARY";
}

export function createAdaptivePresentationSignature(
  input:AdaptivePresentationSignatureInput,
):string{
  return [
    input.director.event,
    input.director.priority,
    input.storyline.chapter,
    input.storyline.title,
    input.creatorId ?? "global",
    input.universeLevel,
  ].join(":");
}

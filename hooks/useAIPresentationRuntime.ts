"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  createAIPresentationEvent,
} from "@/components/live/directorai/presentation/PresentationAIBridge";

import type {
  AIEventDirectorState,
} from "@/components/live/directorai/event/AIEventDirector";

import type {
  LiveStorylineState,
} from "@/components/live/directorai/storyline/LiveStorylineEngine";

import type {
  PresentationEvent,
} from "@/components/live/presentationdirector/types/PresentationEvent";

export interface UseAIPresentationRuntimeInput {
  director:AIEventDirectorState;

  storyline:LiveStorylineState;

  creatorId?:string;
  creatorName?:string;

  cooldownMs?:number;
}

export function useAIPresentationRuntime(
  input:UseAIPresentationRuntimeInput,
):PresentationEvent | null{
  const [
    event,
    setEvent,
  ]=useState<
    PresentationEvent | null
  >(null);

  const lastSignature=
    useRef<string | null>(
      null,
    );

  const lastTriggeredAt=
    useRef(0);

  useEffect(() => {
    if(
      !input.director.shouldPresent ||
      input.director.event === "NONE" ||
      !input.storyline.active
    ){
      return;
    }

    const signature=[
      input.director.event,
      input.director.priority,
      input.storyline.chapter,
      input.creatorId ?? "",
      input.storyline.title,
    ].join(":");

    if(
      lastSignature.current ===
      signature
    ){
      return;
    }

    const now=
      Date.now();

    const cooldownMs=
      Math.max(
        3500,
        input.cooldownMs ??
        5000,
      );

    if(
      now -
      lastTriggeredAt.current <
      cooldownMs
    ){
      return;
    }

    const nextEvent=
      createAIPresentationEvent({
        director:
          input.director,

        storyline:
          input.storyline,

        creatorId:
          input.creatorId,

        creatorName:
          input.creatorName,

        createdAt:
          now,
      });

    if(!nextEvent){
      return;
    }

    lastSignature.current=
      signature;

    lastTriggeredAt.current=
      now;

    setEvent(
      nextEvent,
    );

    const timeout=
      window.setTimeout(
        () => {
          setEvent(
            current =>
              current?.id ===
              nextEvent.id
                ? null
                : current,
          );
        },
        nextEvent.durationMs ??
        4500,
      );

    return () => {
      window.clearTimeout(
        timeout,
      );
    };
  }, [
    input.cooldownMs,
    input.creatorId,
    input.creatorName,
    input.director,
    input.storyline,
  ]);

  return event;
}

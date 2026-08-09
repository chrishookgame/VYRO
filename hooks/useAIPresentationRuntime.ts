"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  createAIPresentationEvent,
} from "@/components/live/directorai/presentation/PresentationAIBridge";

import {
  createAdaptivePresentationPolicy,
  createAdaptivePresentationSignature,
  type AdaptivePresentationPolicy,
} from "@/components/live/directorai/presentation/adaptive";

import type {
  AIEventDirectorState,
} from "@/components/live/directorai/event/AIEventDirector";

import type {
  LiveStorylineState,
} from "@/components/live/directorai/storyline/LiveStorylineEngine";

import type {
  PresentationEvent,
} from "@/components/live/presentationdirector/types/PresentationEvent";

export type AIPresentationUniverseLevel =
  | "NORMAL"
  | "GLOBAL"
  | "WORLD"
  | "LEGENDARY";

export interface UseAIPresentationRuntimeInput {
  director:AIEventDirectorState;

  storyline:LiveStorylineState;

  creatorId?:string;
  creatorName?:string;

  creatorRank?:number;
  creatorScore?:number;
  creatorChampionships?:number;
  creatorCompetitivePower?:number;

  excitementScore?:number;

  universeLevel?:
    AIPresentationUniverseLevel;

  cooldownMs?:number;
}

export interface AIPresentationRuntimeState {
  event:
    PresentationEvent | null;

  policy:
    AdaptivePresentationPolicy;

  signature:
    string;

  intensity:
    AdaptivePresentationPolicy[
      "intensity"
    ];

  allowPreemption:
    boolean;

  cinematicScale:
    number;

  overlayStrength:
    number;

  priorityBoost:
    number;
}

export function useAIPresentationRuntime(
  input:UseAIPresentationRuntimeInput,
):AIPresentationRuntimeState{
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

  const signatureTriggeredAt=
    useRef<
      Record<string,number>
    >({});

  const expirationTimeoutRef=
    useRef<
      number | null
    >(null);

  const policy=
    useMemo(
      () =>
        createAdaptivePresentationPolicy({
          director:
            input.director,

          storyline:
            input.storyline,

          excitementScore:
            input.excitementScore ??
            0,

          universeLevel:
            input.universeLevel ??
            "NORMAL",
        }),
      [
        input.director,
        input.excitementScore,
        input.storyline,
        input.universeLevel,
      ],
    );

  const signature=
    useMemo(
      () =>
        createAdaptivePresentationSignature({
          director:
            input.director,

          storyline:
            input.storyline,

          creatorId:
            input.creatorId,

          universeLevel:
            input.universeLevel ??
            "NORMAL",
        }),
      [
        input.creatorId,
        input.director,
        input.storyline,
        input.universeLevel,
      ],
    );

  useEffect(() => {
    if(
      !input.director.shouldPresent ||
      input.director.event === "NONE" ||
      !input.storyline.active
    ){
      return;
    }

    const now=
      Date.now();

    const previousSignatureTime=
      signatureTriggeredAt
        .current[
          signature
        ] ?? 0;

    if(
      now -
      previousSignatureTime <
      policy.repeatProtectionMs
    ){
      return;
    }

    const cooldownMs=
      Math.max(
        policy.cooldownMs,
        input.cooldownMs ??
        0,
      );

    if(
      now -
      lastTriggeredAt.current <
      cooldownMs
    ){
      return;
    }

    if(
      lastSignature.current ===
        signature &&
      now -
        previousSignatureTime <
        policy.repeatProtectionMs
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

        rank:
          input.creatorRank,

        score:
          input.creatorScore,
        championships:
          input.creatorChampionships,

        competitivePower:
          input.creatorCompetitivePower,

        createdAt:
          now,
      });

    if(!nextEvent){
      return;
    }

    const adaptiveEvent:
      PresentationEvent={
        ...nextEvent,

        durationMs:
          policy.durationMs,
      };

    lastSignature.current=
      signature;

    lastTriggeredAt.current=
      now;

    signatureTriggeredAt.current[
      signature
    ]=now;

    setEvent(
      adaptiveEvent,
    );

    if(expirationTimeoutRef.current){
      window.clearTimeout(
        expirationTimeoutRef.current,
      );
    }

    expirationTimeoutRef.current=
      window.setTimeout(
        () => {
          setEvent(
            current =>
              current?.id ===
              adaptiveEvent.id
                ? null
                : current,
          );

          expirationTimeoutRef.current=
            null;
        },
        policy.durationMs,
      );
  }, [
    input.cooldownMs,
    input.creatorId,
    input.creatorName,
    input.creatorRank,
    input.creatorScore,
    input.creatorChampionships,
    input.creatorCompetitivePower,
    input.director,
    input.storyline,
    policy.cooldownMs,
    policy.durationMs,
    policy.repeatProtectionMs,
    signature,
  ]);

  useEffect(
    () => {
      return () => {
        if(expirationTimeoutRef.current){
          window.clearTimeout(
            expirationTimeoutRef.current,
          );

          expirationTimeoutRef.current=
            null;
        }
      };
    },
    [],
  );

  return {
    event,

    policy,

    signature,

    intensity:
      policy.intensity,

    allowPreemption:
      policy.allowPreemption,

    cinematicScale:
      policy.cinematicScale,

    overlayStrength:
      policy.overlayStrength,

    priorityBoost:
      policy.priorityBoost,
  };
}

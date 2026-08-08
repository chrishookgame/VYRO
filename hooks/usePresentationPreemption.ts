"use client";

import {
  useCallback,
  useState,
} from "react";

import {
  createPresentationCooldownMemory,
  isPresentationEventOnCooldown,
  rememberPresentationEvent,
  type PresentationCooldownConfig,
} from "@/components/live/presentationdirector/cooldown/PresentationCooldown";

import {
  resolvePresentationPreemption,
} from "@/components/live/presentationdirector/preemption/PresentationPreemption";

import type {
  ScheduledPresentationEvent,
} from "@/components/live/presentationdirector/types/PresentationEvent";

export function usePresentationPreemption(
  cooldownConfig?: PresentationCooldownConfig,
) {
  const [
    memory,
    setMemory,
  ] = useState(
    () =>
      createPresentationCooldownMemory(),
  );

  const evaluateEvent = useCallback(
    (
      activeEvent:
        ScheduledPresentationEvent | null,

      incomingEvent:
        ScheduledPresentationEvent | null,

      now:number,
    ) => {
      if(!incomingEvent){
        return {
          decision:
            resolvePresentationPreemption(
              activeEvent,
              null,
            ),

          incomingOnCooldown:false,
        };
      }

      const incomingOnCooldown =
        isPresentationEventOnCooldown(
          incomingEvent,
          memory,
          now,
          cooldownConfig,
        );

      if(incomingOnCooldown){
        return {
          decision:{
            shouldPreempt:false,
            activeEvent,
            incomingEvent,

            reason:
              "COOLDOWN_ACTIVE" as const,
          },

          incomingOnCooldown:true,
        };
      }

      return {
        decision:
          resolvePresentationPreemption(
            activeEvent,
            incomingEvent,
          ),

        incomingOnCooldown:false,
      };
    },
    [
      cooldownConfig,
      memory,
    ],
  );

  const rememberShownEvent =
    useCallback(
      (
        event:
          ScheduledPresentationEvent,

        now:number,
      ) => {
        setMemory(
          current =>
            rememberPresentationEvent(
              event,
              current,
              now,
            ),
        );
      },
      [],
    );

  return {
    evaluateEvent,
    rememberShownEvent,
  };
}

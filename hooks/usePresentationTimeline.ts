"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createPresentationRuntime,
  preemptPresentationRuntime,
  tickPresentationRuntime,
  type PresentationRuntimeState,
} from "@/components/live/presentationdirector/runtime/PresentationRuntime";

import {
  usePresentationPreemption,
} from "@/hooks/usePresentationPreemption";

import type {
  ScheduledPresentationEvent,
} from "@/components/live/presentationdirector/types/PresentationEvent";

export function usePresentationTimeline(
  queue:ScheduledPresentationEvent[],
){
  const queueKey=
    useMemo(
      () =>
        queue
          .map(
            event =>
              `${event.id}:${event.priority}:${event.durationMs}`,
          )
          .join("|"),
      [
        queue,
      ],
    );

  const [
    runtime,
    setRuntime,
  ]=
    useState<
      PresentationRuntimeState
    >(
      () =>
        createPresentationRuntime(
          queue,
          Date.now(),
        ),
    );

  const {
    evaluateEvent,
    rememberShownEvent,
  }=
    usePresentationPreemption();

  /*
   * Reconcile incoming Director queue with the
   * currently running Timeline.
   *
   * Important:
   * We DO NOT recreate the runtime here.
   * That would destroy the current active duration
   * and any interrupted event waiting in the queue.
   */
  useEffect(() => {
    const now=
      Date.now();

    const activeEvent=
      runtime.activeEvent;

    const eligibleQueue=
      queue.filter(
        event => {
          if(
            event.id ===
            activeEvent?.id
          ){
            return true;
          }

          const evaluation=
            evaluateEvent(
              null,
              event,
              now,
            );

          return (
            !evaluation
              .incomingOnCooldown
          );
        },
      );

    const incomingEvent=
      eligibleQueue[0] ??
      null;

    if(
      incomingEvent &&
      incomingEvent.id !==
        activeEvent?.id
    ){
      const evaluation=
        evaluateEvent(
          activeEvent,
          incomingEvent,
          now,
        );

      if(
        evaluation.decision
          .shouldPreempt
      ){
        setRuntime(
          current =>
            preemptPresentationRuntime(
              current,
              incomingEvent,
              now,
            ),
        );

        return;
      }
    }

    setRuntime(
      current => {
        const completed=
          new Set(
            current
              .completedEventIds,
          );

        const pendingEvents=
          eligibleQueue.filter(
            event =>
              event.id !==
                current.activeEvent?.id &&
              !completed.has(
                event.id,
              ),
          );

        const samePending=
          pendingEvents.length ===
            current.pendingEvents.length &&
          pendingEvents.every(
            (
              event,
              index,
            ) =>
              event.id ===
              current
                .pendingEvents[
                  index
                ]?.id,
          );

        if(samePending){
          return current;
        }

        return {
          ...current,

          pendingEvents,

          running:
            current.activeEvent !==
              null ||
            pendingEvents.length > 0,
        };
      },
    );
  }, [
    evaluateEvent,
    queue,
    queueKey,
    runtime.activeEvent,
  ]);

  /*
   * Only an event that truly becomes active is
   * recorded in cooldown memory.
   */
  useEffect(() => {
    if(!runtime.activeEvent){
      return;
    }

    rememberShownEvent(
      runtime.activeEvent,
      Date.now(),
    );
  }, [
    rememberShownEvent,
    runtime.activeEvent,
  ]);

  /*
   * Normal Timeline auto-advance.
   */
  useEffect(() => {
    if(!runtime.activeEvent){
      return;
    }

    const remaining=
      Math.max(
        0,
        runtime.activeEvent.durationMs -
        (
          Date.now() -
          (
            runtime.activeSince ??
            Date.now()
          )
        ),
      );

    const timeout=
      window.setTimeout(
        () => {
          setRuntime(
            current =>
              tickPresentationRuntime(
                current,
                Date.now(),
              ),
          );
        },
        remaining,
      );

    return () => {
      window.clearTimeout(
        timeout,
      );
    };
  }, [
    runtime.activeEvent,
    runtime.activeSince,
  ]);

  return runtime;
}

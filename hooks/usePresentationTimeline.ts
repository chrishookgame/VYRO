"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  createPresentationRuntime,
  preemptPresentationRuntime,
  reconcilePresentationRuntime,
  tickPresentationRuntime,
  type PresentationRuntimeState,
} from "@/components/live/presentationdirector/runtime/PresentationRuntime";

import {
  usePresentationPreemption,
} from "@/hooks/usePresentationPreemption";

import {
  usePresentationSequence,
} from "@/hooks/usePresentationSequence";

import type {
  ScheduledPresentationEvent,
} from "@/components/live/presentationdirector/types/PresentationEvent";

export function usePresentationTimeline(
  queue: ScheduledPresentationEvent[],
) {
  const presentationSequence =
    usePresentationSequence(
      queue,
    );

  const sequenceQueue =
    presentationSequence.events;

  const [
    runtime,
    setRuntime,
  ] =
    useState<
      PresentationRuntimeState
    >(
      () =>
        createPresentationRuntime(
          sequenceQueue,
          Date.now(),
        ),
    );

  const {
    evaluateEvent,
    rememberShownEvent,
  } =
    usePresentationPreemption();

  /*
   * Reconcile Director events with the
   * currently running presentation runtime.
   */
  useEffect(() => {
    const now =
      Date.now();

    const activeEvent =
      runtime.activeEvent;

    const completed =
      new Set(
        runtime.completedEventIds,
      );

    const eligibleQueue =
      sequenceQueue.filter(
        event => {
          if (
            event.id ===
            activeEvent?.id
          ) {
            return true;
          }

          if (
            completed.has(
              event.id,
            )
          ) {
            return false;
          }

          const evaluation =
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

    const incomingEvent =
      eligibleQueue.find(
        event =>
          event.id !==
            activeEvent?.id,
      ) ??
      null;

    if (incomingEvent) {
      const evaluation =
        evaluateEvent(
          activeEvent,
          incomingEvent,
          now,
        );

      if (
        evaluation.decision
          .shouldPreempt
      ) {
        setRuntime(
          current => {
            if (
              current.completedEventIds.includes(
                incomingEvent.id,
              )
            ) {
              return current;
            }

            return preemptPresentationRuntime(
              current,
              incomingEvent,
              now,
            );
          },
        );

        return;
      }
    }

    setRuntime(
      current =>
        reconcilePresentationRuntime(
          current,
          eligibleQueue,
        ),
    );
  }, [
    evaluateEvent,
    presentationSequence.key,
    runtime.activeEvent,
    runtime.completedEventIds,
    sequenceQueue,
  ]);

  /*
   * Record presentations only after
   * they truly become active.
   */
  useEffect(() => {
    if (
      !runtime.activeEvent
    ) {
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
   * Automatic runtime progression.
   */
  useEffect(() => {
    if (
      !runtime.activeEvent
    ) {
      return;
    }

    const now =
      Date.now();

    const remaining =
      Math.max(
        0,
        runtime.activeEvent.durationMs -
          (
            now -
            (
              runtime.activeSince ??
              now
            )
          ),
      );

    const timeout =
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

  return {
    ...runtime,

    sequence:
      presentationSequence,
  };
}

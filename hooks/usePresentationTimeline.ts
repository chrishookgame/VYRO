"use client";

import {
  useEffect,
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
   * Reconcile the Director sequence with the
   * currently running Timeline.
   *
   * Completed events are excluded before
   * candidate evaluation so they cannot
   * re-enter the runtime later in the session.
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
      current => {
        const completedIds =
          new Set(
            current.completedEventIds,
          );

        const pendingEvents =
          eligibleQueue.filter(
            event =>
              event.id !==
                current.activeEvent?.id &&
              !completedIds.has(
                event.id,
              ),
          );

        const samePending =
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

        if (samePending) {
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
    presentationSequence.key,
    runtime.activeEvent,
    runtime.completedEventIds,
    sequenceQueue,
  ]);

  /*
   * Record only presentations that
   * truly become active.
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
   * Timeline automatic progression.
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

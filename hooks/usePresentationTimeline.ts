"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  createPresentationRuntime,
  lockPresentationRuntimeExecutionContract,
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
   * Freeze the cinematic execution contract
   * when an event becomes active.
   *
   * Queue changes after this point do not
   * mutate the transition already selected
   * for the active presentation.
   */
  useEffect(() => {
    const activeEvent =
      runtime.activeEvent;

    if (
      !activeEvent ||
      runtime.executionContractLocked
    ) {
      return;
    }

    const item =
      presentationSequence.items.find(
        sequenceItem =>
          sequenceItem.event.id ===
          activeEvent.id,
      );

    setRuntime(
      current =>
        lockPresentationRuntimeExecutionContract(
          current,
          activeEvent.id,
          item?.gapAfterMs ?? 0,
          item?.cinematicChain ?? false,
          item?.nextType
            ? (
                presentationSequence.items[
                  (item?.index ?? -1) + 1
                ]?.event.id ??
                null
              )
            : null,
        ),
    );
  }, [
    presentationSequence.items,
    runtime.activeEvent,
    runtime.executionContractLocked,
  ]);

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

    /*
     * While the cinematic gap is active,
     * pending events may be reconciled but
     * cannot activate early.
     */
    if (
      runtime.gapUntil !== null &&
      now < runtime.gapUntil
    ) {
      setRuntime(
        current =>
          reconcilePresentationRuntime(
            current,
            eligibleQueue,
          ),
      );

      return;
    }

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
    runtime.gapUntil,
    sequenceQueue,
  ]);

  /*
   * Cooldown memory starts only when the
   * event truly becomes active.
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
   * Automatic execution:
   *
   * active event
   * -> locked cinematic gap
   * -> next event
   */
  useEffect(() => {
    const now =
      Date.now();

    if (
      runtime.activeEvent
    ) {
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
    }

    if (
      runtime.gapUntil !== null
    ) {
      const remainingGap =
        Math.max(
          0,
          runtime.gapUntil -
            now,
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
          remainingGap,
        );

      return () => {
        window.clearTimeout(
          timeout,
        );
      };
    }

    return;
  }, [
    runtime.activeEvent,
    runtime.activeSince,
    runtime.gapUntil,
  ]);

  return {
    ...runtime,

    sequence:
      presentationSequence,

    cinematicGapActive:
      runtime.gapUntil !== null,

    cinematicChainActive:
      runtime.activeCinematicChain,
  };
}

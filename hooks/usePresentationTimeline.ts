"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createPresentationRuntime,
  tickPresentationRuntime,
  type PresentationRuntimeState,
} from "@/components/live/presentationdirector/runtime/PresentationRuntime";

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

  useEffect(() => {
    setRuntime(
      createPresentationRuntime(
        queue,
        Date.now(),
      ),
    );
  }, [
    queue,
    queueKey,
  ]);

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

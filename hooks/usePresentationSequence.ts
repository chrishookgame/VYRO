"use client";

import {
  useMemo,
} from "react";

import {
  buildPresentationSequence,
} from "@/components/live/presentationdirector/sequence/PresentationSequence";

import type {
  ScheduledPresentationEvent,
} from "@/components/live/presentationdirector/types/PresentationEvent";

export function usePresentationSequence(
  queue:ScheduledPresentationEvent[],
){
  const key=
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

  return useMemo(
    () => ({
      key,

      ...buildPresentationSequence(
        queue,
      ),
    }),
    [
      key,
      queue,
    ],
  );
}

"use client";

import {
  useMemo,
} from "react";

import {
  createPresentationDirectorState,
} from "@/components/live/presentationdirector/engine/PresentationDirector";

import type {
  PresentationEvent,
} from "@/components/live/presentationdirector/types/PresentationEvent";

export function usePresentationDirector(
  events: PresentationEvent[],
) {
  return useMemo(
    () =>
      createPresentationDirectorState(
        events,
      ),
    [
      events,
    ],
  );
}

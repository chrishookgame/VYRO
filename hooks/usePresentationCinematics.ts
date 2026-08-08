"use client";

import {
  useMemo,
} from "react";

import {
  getPresentationCinematic,
  isWorldCinematic,
} from "@/components/live/presentationdirector/cinematics/PresentationCinematics";

import {
  createWorldChampionPresentation,
} from "@/components/live/presentationdirector/worldchampion/WorldChampionPresentation";

import type {
  ScheduledPresentationEvent,
} from "@/components/live/presentationdirector/types/PresentationEvent";

export function usePresentationCinematics(
  event:
    ScheduledPresentationEvent | null,
){
  return useMemo(
    () => {
      const cinematic =
        getPresentationCinematic(
          event,
        );

      const worldChampion =
        event &&
        isWorldCinematic(event)
          ? createWorldChampionPresentation(
              event,
            )
          : null;

      return {
        cinematic,
        worldChampion,
        isWorldChampion:
          worldChampion !== null,
      };
    },
    [
      event,
    ],
  );
}

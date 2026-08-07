"use client";

import {
  useMemo,
} from "react";

import type {
  CompetitiveOrchestratorEvent,
} from "@/components/live/competitiveorchestrator/types/CompetitiveOrchestratorTypes";

import {
  resolveCompetitiveCelebration,
} from "@/components/live/competitiveexperience/celebrations/CompetitiveCelebrations";

import type {
  CompetitiveVisualEvent,
} from "@/components/live/competitivevisuals/types/CompetitiveVisualTypes";

interface UseCompetitiveVisualsInput {
  events: CompetitiveOrchestratorEvent[];
  hype: number;
}

export function useCompetitiveVisuals({
  events,
  hype,
}: UseCompetitiveVisualsInput) {
  return useMemo(
    () => {
      const queue:CompetitiveVisualEvent[]=
        [...events]
          .sort(
            (a,b) => {
              if(
                b.priority !==
                a.priority
              ){
                return (
                  b.priority -
                  a.priority
                );
              }

              return (
                b.createdAt -
                a.createdAt
              );
            },
          )
          .map(
            event => {
              const celebration =
                resolveCompetitiveCelebration(
                  event.type,
                );

              return {
                id:event.id,

                kind:event.type,

                creatorId:event.creatorId,
                creatorName:event.creatorName,

                message:event.message,

                priority:event.priority,

                animation:
                  celebration.animation,

                duration:
                  celebration.duration,

                spotlight:
                  celebration.spotlight,

                createdAt:event.createdAt,
              };
            },
          );

      const primaryEvent =
        queue[0] ?? null;

      return {
        visible:
          primaryEvent !== null,

        primaryEvent,

        queue,

        hype:
          Math.min(
            100,
            Math.max(
              0,
              Math.round(
                hype,
              ),
            ),
          ),

        championVisible:
          primaryEvent?.kind ===
          "CHAMPION",

        mvpVisible:
          primaryEvent?.kind ===
          "MVP",

        streakVisible:
          primaryEvent?.kind ===
          "WIN_STREAK",

        topRankVisible:
          primaryEvent?.kind ===
          "RANK_UP",

        spotlightVisible:
          primaryEvent?.spotlight ??
          false,
      };
    },
    [
      events,
      hype,
    ],
  );
}

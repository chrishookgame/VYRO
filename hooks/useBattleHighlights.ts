"use client";

import {
  useMemo,
} from "react";

import type {
  BattleTimelineEvent,
} from "@/components/live/battle/timeline/types";

import type {
  BattleHighlight,
} from "@/components/live/battle/highlights/types";

interface UseBattleHighlightsInput {
  events: BattleTimelineEvent[];
  limit?: number;
}

export function useBattleHighlights({
  events,
  limit = 8,
}: UseBattleHighlightsInput) {
  const highlights =
    useMemo<
      BattleHighlight[]
    >(() => {
      return events
        .map(
          (
            event,
          ):
            BattleHighlight | null => {
            if (
              event.type ===
              "series_finished"
            ) {
              return {
                id:
                  `highlight:${event.id}`,
                type:
                  "champion",
                title:
                  event.title,
                description:
                  event.description,
                createdAt:
                  event.createdAt,
                priority:
                  100,
              };
            }

            if (
              event.type ===
              "score_changed"
            ) {
              return {
                id:
                  `highlight:${event.id}`,
                type:
                  "victory",
                title:
                  event.title,
                description:
                  event.description,
                createdAt:
                  event.createdAt,
                priority:
                  80,
              };
            }

            if (
              event.type ===
              "round_draw"
            ) {
              return {
                id:
                  `highlight:${event.id}`,
                type:
                  "draw",
                title:
                  event.title,
                description:
                  event.description,
                createdAt:
                  event.createdAt,
                priority:
                  55,
              };
            }

            if (
              event.type ===
              "round_started"
            ) {
              return {
                id:
                  `highlight:${event.id}`,
                type:
                  "moment",
                title:
                  event.title,
                description:
                  event.description,
                createdAt:
                  event.createdAt,
                priority:
                  25,
              };
            }

            return null;
          },
        )
        .filter(
          (
            highlight,
          ): highlight is BattleHighlight =>
            Boolean(
              highlight,
            ),
        )
        .sort(
          (left, right) =>
            right.priority -
              left.priority ||
            right.createdAt -
              left.createdAt,
        )
        .slice(
          0,
          limit,
        );
    }, [
      events,
      limit,
    ]);

  return {
    highlights,
  };
}

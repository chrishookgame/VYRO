"use client";

import {
  useMemo,
} from "react";

import type {
  BattleAnalyticsSnapshot,
} from "@/components/live/battle/analytics/types";

import type {
  BattleDirectorState,
} from "@/components/live/battle/director/types";

import type {
  BattleHighlight,
} from "@/components/live/battle/highlights/types";

import type {
  BattleTimelineEvent,
} from "@/components/live/battle/timeline/types";

import type {
  BattleRecapData,
} from "@/components/live/battle/recap/types";

interface UseBattleRecapInput {
  analytics: BattleAnalyticsSnapshot;
  director: BattleDirectorState;
  highlights: BattleHighlight[];
  timeline: BattleTimelineEvent[];

  leftCreatorName: string | null;
  rightCreatorName: string | null;

  winnerName: string | null;
}

export function useBattleRecap({
  analytics,
  director,
  highlights,
  timeline,
  leftCreatorName,
  rightCreatorName,
  winnerName,
}: UseBattleRecapInput) {
  const recap =
    useMemo<
      BattleRecapData
    >(() => {
      const finalScore =
        `${analytics.leftWins} - ${analytics.rightWins}`;

      let mvp:
        string | null =
          null;

      if (
        analytics.leftWins >
        analytics.rightWins
      ) {
        mvp =
          leftCreatorName;
      } else if (
        analytics.rightWins >
        analytics.leftWins
      ) {
        mvp =
          rightCreatorName;
      } else {
        mvp =
          winnerName;
      }

      const selectedHighlights =
        highlights
          .slice(
            0,
            5,
          )
          .map(
            (highlight) => ({
              id:
                `recap:${highlight.id}`,
              title:
                highlight.title,
              description:
                highlight.description,
            }),
          );

      const recapTimeline =
        timeline
          .slice(
            0,
            8,
          )
          .map(
            (event) => ({
              id:
                `recap:${event.id}`,
              title:
                event.title,
              timestamp:
                event.createdAt,
            }),
          );

      const winnerSentence =
        winnerName
          ? `${winnerName} terminó como ganador de la serie.`
          : "La serie terminó sin un campeón único.";

      const scoreSentence =
        `El marcador final fue ${finalScore}, con ${analytics.draws} empate${analytics.draws === 1 ? "" : "s"}.`;

      const intensitySentence =
        `El AI Battle Director registró una intensidad máxima actual de ${director.intensity}%.`;

      const summary =
        [
          winnerSentence,
          scoreSentence,
          intensitySentence,
          director.summary,
        ].join(" ");

      return {
        winnerName,
        finalScore,
        mvp,
        summary,
        highlights:
          selectedHighlights,
        timeline:
          recapTimeline,
      };
    }, [
      analytics,
      director,
      highlights,
      leftCreatorName,
      rightCreatorName,
      timeline,
      winnerName,
    ]);

  return {
    recap,
  };
}

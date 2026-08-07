"use client";

import {
  useMemo,
} from "react";

import type {
  BattleSeriesState,
} from "@/components/live/battle";

import type {
  BattleTimelineEvent,
} from "@/components/live/battle/timeline/types";

import type {
  BattleAnalyticsSnapshot,
} from "@/components/live/battle/analytics/types";

interface UseBattleAnalyticsInput {
  series: BattleSeriesState | null;
  events: BattleTimelineEvent[];
}

function percentage(
  value: number,
  total: number,
): number {
  if (total <= 0) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(
      0,
      Math.round(
        (value / total) *
          100,
      ),
    ),
  );
}

export function useBattleAnalytics({
  series,
  events,
}: UseBattleAnalyticsInput) {
  const analytics =
    useMemo<
      BattleAnalyticsSnapshot
    >(() => {
      const roundsStarted =
        events.filter(
          (event) =>
            event.type ===
            "round_started",
        ).length;


      const timelineDraws =
        events.filter(
          (event) =>
            event.type ===
            "round_draw",
        ).length;

      const leftWins =
        series?.leftWins ??
        0;

      const rightWins =
        series?.rightWins ??
        0;

      const draws =
        series?.draws ??
        timelineDraws;

      const completedRounds =
        leftWins +
        rightWins +
        draws;

      const totalRounds =
        series?.config.totalBattles ??
        0;

      return {
        totalEvents:
          events.length,

        roundsStarted,

        completedRounds,

        victories:
          leftWins +
          rightWins,

        draws,

        completionPercent:
          percentage(
            completedRounds,
            totalRounds,
          ),

        decisiveRate:
          percentage(
            leftWins +
              rightWins,
            completedRounds,
          ),

        drawRate:
          percentage(
            draws,
            completedRounds,
          ),

        leftWins,
        rightWins,
        totalRounds,

        seriesFinished:
          series?.status ===
          "finished",
      };
    }, [
      events,
      series,
    ]);

  return {
    analytics,
  };
}

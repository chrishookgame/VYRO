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
  BattleMVPResult,
} from "@/components/live/battle/mvp/types";

import type {
  BattleRecapData,
} from "@/components/live/battle/recap/types";

import type {
  BattleStoryData,
} from "@/components/live/battle/story/types";

import type {
  BattleHistoryEntry,
} from "@/components/live/battle/history/types";

interface UseBattleHistoryInput {
  analytics: BattleAnalyticsSnapshot;
  director: BattleDirectorState;
  recap: BattleRecapData;
  story: BattleStoryData;
  mvp: BattleMVPResult;
}

export function useBattleHistory({
  analytics,
  director,
  recap,
  story,
  mvp,
}: UseBattleHistoryInput) {
  const entries =
    useMemo<
      BattleHistoryEntry[]
    >(() => {
      const timestamp =
        recap.timeline[0]?.timestamp ??
        analytics.totalEvents * 1000 +
          analytics.completedRounds;

      return [
        {
          id:
            `history:${recap.finalScore}:${timestamp}`,

          winnerName:
            recap.winnerName,

          mvpName:
            mvp.winner?.creatorName ??
            recap.mvp,

          finalScore:
            recap.finalScore,

          completedRounds:
            analytics.completedRounds,

          intensity:
            director.intensity,

          title:
            story.headline,

          summary:
            recap.summary,

          timestamp,
        },
      ];
    }, [
      analytics,
      director,
      mvp,
      recap,
      story,
    ]);

  return {
    entries,
  };
}

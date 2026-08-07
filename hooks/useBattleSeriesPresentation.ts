"use client";

import {
  useMemo,
} from "react";

import type {
  BattleSeriesState,
  LiveBattleState,
} from "@/components/live/battle";

export type BattleSeriesPresentationPhase =
  | "idle"
  | "winner"
  | "versus"
  | "countdown"
  | "battle"
  | "finished";

export interface BattleSeriesPresentation {
  phase: BattleSeriesPresentationPhase;
  winnerName: string | null;
  isSeriesWinner: boolean;
  round: number;
  totalRounds: number;
  startsAt: string | null;
  showWinnerOverlay: boolean;
  showVSOverlay: boolean;
  showRoundTransition: boolean;
  showBattleEngine: boolean;
}

export interface UseBattleSeriesPresentationInput {
  series: BattleSeriesState | null;
  battle: LiveBattleState | null;
  remainingSeconds: number;
  winnerCelebrationVisible: boolean;
}

function resolveCreatorName(
  winnerId: string | null,
  battle: LiveBattleState | null,
): string | null {
  if (
    !winnerId ||
    !battle
  ) {
    return null;
  }

  if (
    winnerId ===
    battle.left.creatorId
  ) {
    return battle.left.creatorName;
  }

  if (
    winnerId ===
    battle.right.creatorId
  ) {
    return battle.right.creatorName;
  }

  return null;
}

export function useBattleSeriesPresentation({
  series,
  battle,
  remainingSeconds,
  winnerCelebrationVisible,
}: UseBattleSeriesPresentationInput):
  BattleSeriesPresentation {
  return useMemo(() => {
    const round =
      series?.currentPosition ?? 0;

    const totalRounds =
      series?.config.totalBattles ?? 0;

    const startsAt =
      series?.nextBattleAt ?? null;

    const isSeriesFinished =
      series?.status === "finished";

    const transitionActive =
      Boolean(
        series &&
        (
          series.status ===
            "scheduled" ||
          series.status ===
            "intermission"
        ) &&
        startsAt,
      );

    const showWinnerOverlay =
      winnerCelebrationVisible;

    const showVSOverlay =
      !showWinnerOverlay &&
      transitionActive &&
      remainingSeconds > 3;

    const showRoundTransition =
      !showWinnerOverlay &&
      transitionActive &&
      remainingSeconds <= 3;

    const showBattleEngine =
      Boolean(battle) &&
      !showWinnerOverlay &&
      !transitionActive;

    let phase:
      BattleSeriesPresentationPhase =
        "idle";

    if (showWinnerOverlay) {
      phase = "winner";
    } else if (showVSOverlay) {
      phase = "versus";
    } else if (showRoundTransition) {
      phase = "countdown";
    } else if (
      isSeriesFinished
    ) {
      phase = "finished";
    } else if (
      showBattleEngine
    ) {
      phase = "battle";
    }

    return {
      phase,
      winnerName:
        isSeriesFinished
          ? resolveCreatorName(
              series?.winnerId ?? null,
              battle,
            )
          : null,
      isSeriesWinner:
        isSeriesFinished,
      round,
      totalRounds,
      startsAt,
      showWinnerOverlay,
      showVSOverlay,
      showRoundTransition,
      showBattleEngine,
    };
  }, [
    battle,
    remainingSeconds,
    series,
    winnerCelebrationVisible,
  ]);
}

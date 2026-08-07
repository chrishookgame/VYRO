"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  BattleSeriesState,
  LiveBattleState,
} from "@/components/live/battle";

import {
  useBattleCountdown,
} from "./useBattleCountdown";

export type BattleSeriesPresentationPhase =
  | "idle"
  | "winner"
  | "versus"
  | "countdown"
  | "battle"
  | "finished";

interface BattleWinnerCelebration {
  key: string;
  winnerName: string | null;
  isSeriesWinner: boolean;
}

interface PreviousSeriesScore {
  seriesId: string;
  leftWins: number;
  rightWins: number;
  draws: number;
  status: string;
}

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

  onWinnerFinished: () => void;
}

export interface UseBattleSeriesPresentationInput {
  series: BattleSeriesState | null;
  battle: LiveBattleState | null;
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
}: UseBattleSeriesPresentationInput):
  BattleSeriesPresentation {
  const [
    winnerCelebration,
    setWinnerCelebration,
  ] =
    useState<BattleWinnerCelebration | null>(
      null,
    );

  const previousSeriesScoreRef =
    useRef<PreviousSeriesScore | null>(
      null,
    );

  const shownCelebrationsRef =
    useRef<Set<string>>(
      new Set(),
    );

  useEffect(() => {
    if (
      !series ||
      !battle
    ) {
      return;
    }

    const previous =
      previousSeriesScoreRef.current;

    previousSeriesScoreRef.current = {
      seriesId:
        series.id,
      leftWins:
        series.leftWins,
      rightWins:
        series.rightWins,
      draws:
        series.draws,
      status:
        series.status,
    };

    if (
      series.status ===
        "finished"
    ) {
      const celebrationKey =
        `${series.id}:champion`;

      if (
        shownCelebrationsRef.current
          .has(celebrationKey)
      ) {
        return;
      }

      shownCelebrationsRef.current.add(
        celebrationKey,
      );

      setWinnerCelebration({
        key:
          celebrationKey,

        winnerName:
          resolveCreatorName(
            series.winnerId,
            battle,
          ),

        isSeriesWinner:
          true,
      });

      return;
    }

    if (
      !previous ||
      previous.seriesId !==
        series.id
    ) {
      return;
    }

    const leftWinAdded =
      series.leftWins >
      previous.leftWins;

    const rightWinAdded =
      series.rightWins >
      previous.rightWins;

    const drawAdded =
      series.draws >
      previous.draws;

    if (
      !leftWinAdded &&
      !rightWinAdded &&
      !drawAdded
    ) {
      return;
    }

    const celebrationKey =
      [
        series.id,
        series.leftWins,
        series.rightWins,
        series.draws,
      ].join(":");

    if (
      shownCelebrationsRef.current
        .has(celebrationKey)
    ) {
      return;
    }

    shownCelebrationsRef.current.add(
      celebrationKey,
    );

    setWinnerCelebration({
      key:
        celebrationKey,

      winnerName:
        leftWinAdded
          ? battle.left.creatorName
          : rightWinAdded
            ? battle.right.creatorName
            : null,

      isSeriesWinner:
        false,
    });
  }, [
    battle,
    series,
  ]);

  const onWinnerFinished =
    useCallback(() => {
      setWinnerCelebration(
        null,
      );
    }, []);

  const transitionActive =
    Boolean(
      series &&
      (
        series.status ===
          "scheduled" ||
        series.status ===
          "intermission"
      ) &&
      series.nextBattleAt,
    );

  const startsAt =
    transitionActive
      ? series?.nextBattleAt ??
        null
      : null;

  const countdown =
    useBattleCountdown({
      phase:
        transitionActive
          ? "scheduled"
          : "idle",

      targetAt:
        startsAt,

      enabled:
        transitionActive,

      tickIntervalMs:
        100,
    });

  return useMemo(() => {
    const round =
      series?.currentPosition ??
      0;

    const totalRounds =
      series?.config.totalBattles ??
      0;

    const showWinnerOverlay =
      Boolean(
        winnerCelebration,
      );

    const showVSOverlay =
      !showWinnerOverlay &&
      transitionActive &&
      countdown.remainingSeconds >
        3;

    const showRoundTransition =
      !showWinnerOverlay &&
      transitionActive &&
      countdown.remainingSeconds <=
        3;

    const showBattleEngine =
      Boolean(battle) &&
      !showWinnerOverlay &&
      !transitionActive;

    const isSeriesFinished =
      series?.status ===
      "finished";

    let phase:
      BattleSeriesPresentationPhase =
        "idle";

    if (
      showWinnerOverlay
    ) {
      phase = "winner";
    } else if (
      showVSOverlay
    ) {
      phase = "versus";
    } else if (
      showRoundTransition
    ) {
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
        winnerCelebration
          ?.winnerName ??
        null,

      isSeriesWinner:
        winnerCelebration
          ?.isSeriesWinner ??
        false,

      round,
      totalRounds,
      startsAt,

      showWinnerOverlay,
      showVSOverlay,
      showRoundTransition,
      showBattleEngine,

      onWinnerFinished,
    };
  }, [
    battle,
    countdown.remainingSeconds,
    onWinnerFinished,
    series,
    startsAt,
    transitionActive,
    winnerCelebration,
  ]);
}

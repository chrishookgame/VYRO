"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  autoBattleDirector,
  battleScheduler,
  type AutoBattleDirectorAction,
  type BattleSeriesConfig,
  type BattleSeriesState,
  type LiveBattleState,
} from "@/components/live/battle";

export interface UseBattleSeriesRuntimeResult {
  series: BattleSeriesState | null;
  battle: LiveBattleState | null;
  lastAction: AutoBattleDirectorAction;
  createSeries: (
    seriesId: string,
    roomId: string,
    config: BattleSeriesConfig,
  ) => void;
  startSeries: () => void;
  assignBattle: (
    battle: LiveBattleState,
  ) => void;
  startCurrentRound: () => void;
  finishCurrentRound: () => void;
  cancelSeries: () => void;
  reset: () => void;
}

export function useBattleSeriesRuntime(
  tickIntervalMs = 1000,
): UseBattleSeriesRuntimeResult {
  const [series, setSeries] =
    useState<BattleSeriesState | null>(
      null,
    );

  const [battle, setBattle] =
    useState<LiveBattleState | null>(
      null,
    );

  const [lastAction, setLastAction] =
    useState<AutoBattleDirectorAction>(
      "none",
    );

  const seriesRef =
    useRef<BattleSeriesState | null>(
      null,
    );

  const battleRef =
    useRef<LiveBattleState | null>(
      null,
    );

  const updateState = useCallback(
    (
      nextSeries: BattleSeriesState | null,
      nextBattle: LiveBattleState | null,
      action: AutoBattleDirectorAction,
    ) => {
      seriesRef.current =
        nextSeries;

      battleRef.current =
        nextBattle;

      setSeries(nextSeries);
      setBattle(nextBattle);
      setLastAction(action);
    },
    [],
  );

  const createSeries = useCallback(
    (
      seriesId: string,
      roomId: string,
      config: BattleSeriesConfig,
    ) => {
      const nextSeries =
        battleScheduler.createSeries(
          seriesId,
          roomId,
          config,
        );

      updateState(
        nextSeries,
        null,
        "none",
      );
    },
    [updateState],
  );

  const startSeries = useCallback(
    () => {
      const currentSeries =
        seriesRef.current;

      if (!currentSeries) {
        return;
      }

      const result =
        autoBattleDirector.startSeries(
          currentSeries,
        );

      updateState(
        result.series,
        result.battle,
        result.action,
      );
    },
    [updateState],
  );

  const assignBattle = useCallback(
    (
      nextBattle: LiveBattleState,
    ) => {
      battleRef.current =
        nextBattle;

      setBattle(nextBattle);
      setLastAction("none");
    },
    [],
  );

  const startCurrentRound =
    useCallback(() => {
      const currentSeries =
        seriesRef.current;

      const currentBattle =
        battleRef.current;

      if (
        !currentSeries ||
        !currentBattle
      ) {
        return;
      }

      const result =
        autoBattleDirector.startRound(
          currentSeries,
          {
            battle: currentBattle,
          },
        );

      updateState(
        result.series,
        result.battle,
        result.action,
      );
    }, [updateState]);

  const finishCurrentRound =
    useCallback(() => {
      const currentSeries =
        seriesRef.current;

      const currentBattle =
        battleRef.current;

      if (
        !currentSeries ||
        !currentBattle
      ) {
        return;
      }

      const result =
        autoBattleDirector.finishRound({
          series:
            currentSeries,
          battle:
            currentBattle,
        });

      updateState(
        result.series,
        result.battle,
        result.action,
      );
    }, [updateState]);

  const cancelSeries = useCallback(
    () => {
      const currentSeries =
        seriesRef.current;

      if (!currentSeries) {
        return;
      }

      const result =
        autoBattleDirector.cancel(
          currentSeries,
          battleRef.current,
        );

      updateState(
        result.series,
        result.battle,
        result.action,
      );
    },
    [updateState],
  );

  const reset = useCallback(() => {
    updateState(
      null,
      null,
      "none",
    );
  }, [updateState]);

  useEffect(() => {
    const safeInterval =
      Math.max(
        250,
        Math.floor(
          tickIntervalMs,
        ),
      );

    const intervalId =
      window.setInterval(() => {
        const currentSeries =
          seriesRef.current;

        if (!currentSeries) {
          return;
        }

        const result =
          autoBattleDirector.tick(
            currentSeries,
            battleRef.current,
          );

        if (
          result.series !==
            currentSeries ||
          result.battle !==
            battleRef.current ||
          result.action !== "none"
        ) {
          updateState(
            result.series,
            result.battle,
            result.action,
          );
        }
      }, safeInterval);

    return () => {
      window.clearInterval(
        intervalId,
      );
    };
  }, [
    tickIntervalMs,
    updateState,
  ]);

  return {
    series,
    battle,
    lastAction,
    createSeries,
    startSeries,
    assignBattle,
    startCurrentRound,
    finishCurrentRound,
    cancelSeries,
    reset,
  };
}

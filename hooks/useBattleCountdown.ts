"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  battleCountdownManager,
  type BattleCountdownPhase,
  type BattleCountdownSnapshot,
} from "@/components/live/battle";

export interface UseBattleCountdownInput {
  phase: BattleCountdownPhase;
  targetAt: string | null;
  tickIntervalMs?: number;
  enabled?: boolean;
}

export interface UseBattleCountdownResult
  extends BattleCountdownSnapshot {
  ready: boolean;
}

export function useBattleCountdown({
  phase,
  targetAt,
  tickIntervalMs = 250,
  enabled = true,
}: UseBattleCountdownInput):
  UseBattleCountdownResult {
  const [now, setNow] =
    useState(() => new Date());

  const safeInterval = useMemo(
    () =>
      Math.max(
        100,
        Math.floor(
          tickIntervalMs,
        ),
      ),
    [tickIntervalMs],
  );

  useEffect(() => {
    setNow(new Date());

    if (
      !enabled ||
      !targetAt ||
      phase === "idle" ||
      phase === "finished"
    ) {
      return;
    }

    const intervalId =
      window.setInterval(() => {
        setNow(new Date());
      }, safeInterval);

    return () => {
      window.clearInterval(
        intervalId,
      );
    };
  }, [
    enabled,
    phase,
    safeInterval,
    targetAt,
  ]);

  const snapshot = useMemo(
    () =>
      battleCountdownManager
        .createSnapshot({
          phase,
          targetAt,
          now,
        }),
    [
      now,
      phase,
      targetAt,
    ],
  );

  return {
    ...snapshot,
    ready:
      enabled &&
      battleCountdownManager
        .isReady(snapshot),
  };
}

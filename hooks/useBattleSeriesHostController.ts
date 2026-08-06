"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  LiveBattleState,
} from "@/components/live/battle";

import type {
  LiveBattleSeriesDetails,
} from "@/lib/live-battle-series";

export interface UseBattleSeriesHostControllerInput {
  enabled: boolean;
  series:
    | LiveBattleSeriesDetails["state"]
    | null;
  battle: LiveBattleState | null;
  advanceRound: (
    battleId: string,
  ) => Promise<LiveBattleSeriesDetails | null>;
  tickIntervalMs?: number;
}

export interface UseBattleSeriesHostControllerResult {
  processing: boolean;
  lastProcessedBattleId: string | null;
  error: string;
}

export function useBattleSeriesHostController({
  enabled,
  series,
  battle,
  advanceRound,
  tickIntervalMs = 1000,
}: UseBattleSeriesHostControllerInput):
  UseBattleSeriesHostControllerResult {
  const [processing, setProcessing] =
    useState(false);

  const [lastProcessedBattleId, setLastProcessedBattleId] =
    useState<string | null>(null);

  const [error, setError] =
    useState("");

  const processingBattleIdRef =
    useRef<string | null>(null);

  const lastProcessedBattleIdRef =
    useRef<string | null>(null);

  useEffect(() => {
    if (
      lastProcessedBattleIdRef.current &&
      battle?.id !==
        lastProcessedBattleIdRef.current
    ) {
      lastProcessedBattleIdRef.current =
        null;

      setLastProcessedBattleId(null);
    }
  }, [battle?.id]);

  useEffect(() => {
    if (
      !enabled ||
      !series ||
      !battle ||
      series.status === "finished" ||
      series.status === "cancelled"
    ) {
      return;
    }

    const safeInterval =
      Math.max(
        250,
        Math.floor(
          tickIntervalMs,
        ),
      );

    const intervalId =
      window.setInterval(() => {
        if (
          processingBattleIdRef.current ===
            battle.id ||
          lastProcessedBattleIdRef.current ===
            battle.id
        ) {
          return;
        }

        const endsAt =
          battle.endsAt
            ? new Date(
                battle.endsAt,
              ).getTime()
            : null;

        const expired =
          endsAt !== null &&
          Number.isFinite(endsAt) &&
          Date.now() >= endsAt;

        const finished =
          battle.status === "finished";

        if (!expired && !finished) {
          return;
        }

        processingBattleIdRef.current =
          battle.id;

        setProcessing(true);
        setError("");

        void advanceRound(
          battle.id,
        )
          .then((result) => {
            if (!result) {
              throw new Error(
                "No se pudo avanzar la Battle Series.",
              );
            }

            lastProcessedBattleIdRef.current =
              battle.id;

            setLastProcessedBattleId(
              battle.id,
            );
          })
          .catch((controllerError) => {
            setError(
              controllerError instanceof Error
                ? controllerError.message
                : "No se pudo procesar el final de la batalla.",
            );
          })
          .finally(() => {
            processingBattleIdRef.current =
              null;

            setProcessing(false);
          });
      }, safeInterval);

    return () => {
      window.clearInterval(
        intervalId,
      );
    };
  }, [
    advanceRound,
    battle,
    enabled,
    series,
    tickIntervalMs,
  ]);

  return {
    processing,
    lastProcessedBattleId,
    error,
  };
}

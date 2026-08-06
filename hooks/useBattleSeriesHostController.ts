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
  startRound: (
    battleId: string,
  ) => Promise<LiveBattleSeriesDetails | null>;
  advanceRound: (
    battleId: string,
  ) => Promise<LiveBattleSeriesDetails | null>;
  tickIntervalMs?: number;
}

export interface UseBattleSeriesHostControllerResult {
  processing: boolean;
  lastStartedBattleId: string | null;
  lastProcessedBattleId: string | null;
  error: string;
}

export function useBattleSeriesHostController({
  enabled,
  series,
  battle,
  startRound,
  advanceRound,
  tickIntervalMs = 1000,
}: UseBattleSeriesHostControllerInput):
  UseBattleSeriesHostControllerResult {
  const [processing, setProcessing] =
    useState(false);

  const [
    lastStartedBattleId,
    setLastStartedBattleId,
  ] = useState<string | null>(null);

  const [
    lastProcessedBattleId,
    setLastProcessedBattleId,
  ] = useState<string | null>(null);

  const [error, setError] =
    useState("");

  const processingKeyRef =
    useRef<string | null>(null);

  const lastStartedBattleIdRef =
    useRef<string | null>(null);

  const lastProcessedBattleIdRef =
    useRef<string | null>(null);

  useEffect(() => {
    if (
      lastStartedBattleIdRef.current &&
      battle?.id !==
        lastStartedBattleIdRef.current
    ) {
      lastStartedBattleIdRef.current =
        null;

      setLastStartedBattleId(null);
    }

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

    const runStartRound = () => {
      const actionKey =
        `start:${battle.id}`;

      if (
        processingKeyRef.current ||
        lastStartedBattleIdRef.current ===
          battle.id
      ) {
        return;
      }

      processingKeyRef.current =
        actionKey;

      setProcessing(true);
      setError("");

      void startRound(
        battle.id,
      )
        .then((result) => {
          if (!result) {
            throw new Error(
              "No se pudo iniciar la ronda de batalla.",
            );
          }

          lastStartedBattleIdRef.current =
            battle.id;

          setLastStartedBattleId(
            battle.id,
          );
        })
        .catch((controllerError) => {
          setError(
            controllerError instanceof Error
              ? controllerError.message
              : "No se pudo iniciar la ronda de batalla.",
          );
        })
        .finally(() => {
          if (
            processingKeyRef.current ===
            actionKey
          ) {
            processingKeyRef.current =
              null;
          }

          setProcessing(false);
        });
    };

    const runAdvanceRound = () => {
      const actionKey =
        `advance:${battle.id}`;

      if (
        processingKeyRef.current ||
        lastProcessedBattleIdRef.current ===
          battle.id
      ) {
        return;
      }

      processingKeyRef.current =
        actionKey;

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
          if (
            processingKeyRef.current ===
            actionKey
          ) {
            processingKeyRef.current =
              null;
          }

          setProcessing(false);
        });
    };

    const intervalId =
      window.setInterval(() => {
        const now = Date.now();

        const seriesCanStart =
          series.status === "scheduled" ||
          series.status === "waiting" ||
          series.status === "intermission";

        if (
          seriesCanStart &&
          battle.status === "waiting"
        ) {
          const targetTime =
            series.nextBattleAt
              ? new Date(
                  series.nextBattleAt,
                ).getTime()
              : null;

          const readyToStart =
            targetTime === null ||
            (
              Number.isFinite(
                targetTime,
              ) &&
              now >= targetTime
            );

          if (readyToStart) {
            runStartRound();
          }

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
          now >= endsAt;

        const finished =
          battle.status === "finished";

        if (
          expired ||
          finished
        ) {
          runAdvanceRound();
        }
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
    startRound,
    tickIntervalMs,
  ]);

  return {
    processing,
    lastStartedBattleId,
    lastProcessedBattleId,
    error,
  };
}

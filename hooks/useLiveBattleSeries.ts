"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  advanceBattleSeriesRound,
  finishLiveBattleSeries,
  getActiveLiveBattleSeries,
  type LiveBattleSeriesDetails,
} from "@/lib/live-battle-series";

import { supabase } from "@/lib/supabase";

export interface FinishLiveBattleSeriesInput {
  winnerId: string | null;
  leftWins: number;
  rightWins: number;
  draws: number;
}

export interface UseLiveBattleSeriesResult {
  details: LiveBattleSeriesDetails | null;
  series:
    | LiveBattleSeriesDetails["state"]
    | null;
  loading: boolean;
  connected: boolean;
  error: string;
  refresh: () => Promise<void>;
  advanceRound: (
    battleId: string,
  ) => Promise<LiveBattleSeriesDetails | null>;
  finishSeries: (
    input: FinishLiveBattleSeriesInput,
  ) => Promise<LiveBattleSeriesDetails | null>;
}

export function useLiveBattleSeries(
  roomId: string | null | undefined,
): UseLiveBattleSeriesResult {
  const [details, setDetails] =
    useState<LiveBattleSeriesDetails | null>(
      null,
    );

  const [loading, setLoading] =
    useState(true);

  const [connected, setConnected] =
    useState(false);

  const [error, setError] =
    useState("");

  const refresh = useCallback(
    async () => {
      if (!roomId) {
        setDetails(null);
        setLoading(false);
        setError("");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const nextDetails =
          await getActiveLiveBattleSeries(
            roomId,
          );

        setDetails(nextDetails);
      } catch (seriesError) {
        setDetails(null);

        setError(
          seriesError instanceof Error
            ? seriesError.message
            : "No se pudo cargar la Battle Series.",
        );
      } finally {
        setLoading(false);
      }
    },
    [roomId],
  );

  const advanceRound = useCallback(
    async (
      battleId: string,
    ) => {
      if (!details) {
        return null;
      }

      setError("");

      try {
        const nextDetails =
          await advanceBattleSeriesRound(
            details.row.id,
            battleId,
          );

        setDetails(nextDetails);

        return nextDetails;
      } catch (seriesError) {
        setError(
          seriesError instanceof Error
            ? seriesError.message
            : "No se pudo avanzar la Battle Series.",
        );

        return null;
      }
    },
    [details],
  );

  const finishSeries = useCallback(
    async (
      input: FinishLiveBattleSeriesInput,
    ) => {
      if (!details) {
        return null;
      }

      setError("");

      try {
        const nextDetails =
          await finishLiveBattleSeries(
            details.row.id,
            input.winnerId,
            input.leftWins,
            input.rightWins,
            input.draws,
          );

        setDetails(nextDetails);

        return nextDetails;
      } catch (seriesError) {
        setError(
          seriesError instanceof Error
            ? seriesError.message
            : "No se pudo finalizar la Battle Series.",
        );

        return null;
      }
    },
    [details],
  );

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!roomId) {
      setConnected(false);
      return;
    }

    const channel = supabase
      .channel(
        `vyro-live-battle-series:${roomId}`,
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table:
            "live_battle_series",
          filter:
            `room_id=eq.${roomId}`,
        },
        () => {
          void refresh();
        },
      )
      .subscribe((status) => {
        setConnected(
          status === "SUBSCRIBED",
        );
      });

    return () => {
      setConnected(false);

      void supabase.removeChannel(
        channel,
      );
    };
  }, [refresh, roomId]);

  return {
    details,
    series:
      details?.state ?? null,
    loading,
    connected,
    error,
    refresh,
    advanceRound,
    finishSeries,
  };
}

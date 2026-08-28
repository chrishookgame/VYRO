"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  advanceBattleSeriesRound,
  getActiveLiveBattleSeries,
  getLiveBattleSeriesById,
  type LiveBattleSeriesDetails,
} from "@/lib/live-battle-series";

import { supabase } from "@/lib/supabase";

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
        (payload) => {
          const changedSeries =
            payload.new as {
              id?: string;
              status?: string;
            };

          if (
            changedSeries.id &&
            changedSeries.status ===
              "finished"
          ) {
            void getLiveBattleSeriesById(
              changedSeries.id,
            )
              .then((finishedSeries) => {
                if (finishedSeries) {
                  setDetails(
                    finishedSeries,
                  );
                }
              })
              .catch((seriesError) => {
                setError(
                  seriesError instanceof Error
                    ? seriesError.message
                    : "No se pudo cargar el resultado final de la Battle Series.",
                );
              });

            return;
          }

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
  };
}

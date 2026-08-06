"use client";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

export interface UseLiveBattleRealtimeResult {
  connected: boolean;
  version: number;
}

export function useLiveBattleRealtime(
  battleId: string | null | undefined,
): UseLiveBattleRealtimeResult {
  const [connected, setConnected] =
    useState(false);

  const [version, setVersion] =
    useState(0);

  useEffect(() => {
    if (!battleId) {
      setConnected(false);
      return;
    }

    const channel = supabase
      .channel(
        `live-battle-${battleId}`,
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "live_battles",
          filter: `id=eq.${battleId}`,
        },
        () => {
          setVersion(
            (value) => value + 1,
          );
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
  }, [battleId]);

  return {
    connected,
    version,
  };
}

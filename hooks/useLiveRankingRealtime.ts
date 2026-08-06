"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

export interface LiveRankingRealtimeState {
  version: number;
  connected: boolean;
}

export function useLiveRankingRealtime(
  roomId: string,
): LiveRankingRealtimeState {
  const [version, setVersion] = useState(0);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!roomId) {
      setConnected(false);
      return;
    }

    const channel = supabase
      .channel(`live-ranking-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "live_ranking_scores",
          filter: `room_id=eq.${roomId}`,
        },
        () => {
          setVersion((value) => value + 1);
        },
      )
      .subscribe((status) => {
        setConnected(status === "SUBSCRIBED");
      });

    return () => {
      void supabase.removeChannel(channel);
      setConnected(false);
    };
  }, [roomId]);

  return {
    version,
    connected,
  };
}

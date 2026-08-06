"use client";

import { useEffect, useState } from "react";

export interface LiveRankingRealtimeState {
  version: number;
  connected: boolean;
}

export function useLiveRankingRealtime(
  roomId: string,
): LiveRankingRealtimeState {
  const [version] =
    useState(0);

  const [connected, setConnected] =
    useState(false);

  useEffect(() => {
    if (!roomId) {
      return;
    }

    setConnected(true);

    return () => {
      setConnected(false);
    };
  }, [roomId]);

  return {
    version,
    connected,
  };
}

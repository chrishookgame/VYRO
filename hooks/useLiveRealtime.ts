"use client";

import { useEffect, useState } from "react";

import {
  subscribeToLiveRoom,
  unsubscribeFromLiveRoom,
  type LiveRealtimeUpdate,
} from "@/lib/live";

export interface UseLiveRealtimeResult {
  connected: boolean;
  lastUpdate: LiveRealtimeUpdate | null;
  counterVersion: number;
  reactionVersion: number;
  giftVersion: number;
  rankingVersion: number;
  eventVersion: number;
}

export function useLiveRealtime(
  roomId: string | null | undefined,
): UseLiveRealtimeResult {
  const [connected, setConnected] = useState(false);

  const [lastUpdate, setLastUpdate] =
    useState<LiveRealtimeUpdate | null>(null);

  const [counterVersion, setCounterVersion] = useState(0);
  const [reactionVersion, setReactionVersion] = useState(0);
  const [giftVersion, setGiftVersion] = useState(0);
  const [rankingVersion, setRankingVersion] = useState(0);
  const [eventVersion, setEventVersion] = useState(0);

  useEffect(() => {
    if (!roomId) {
      setConnected(false);
      return;
    }

    const channel = subscribeToLiveRoom(
      roomId,
      (update) => {
        setLastUpdate(update);

        if (update.type === "counter") {
          setCounterVersion((value) => value + 1);
        }

        if (update.type === "reaction") {
          setReactionVersion((value) => value + 1);
        }

        if (update.type === "gift") {
          setGiftVersion((value) => value + 1);
        }

        if (update.type === "ranking") {
          setRankingVersion((value) => value + 1);
        }

        if (update.type === "event") {
          setEventVersion((value) => value + 1);
        }
      },
    );

    setConnected(true);

    return () => {
      setConnected(false);
      void unsubscribeFromLiveRoom(channel);
    };
  }, [roomId]);

  return {
    connected,
    lastUpdate,
    counterVersion,
    reactionVersion,
    giftVersion,
    rankingVersion,
    eventVersion,
  };
}

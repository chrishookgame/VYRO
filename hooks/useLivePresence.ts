"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  joinLiveRoom,
  leaveLiveRoom,
  type LivePresenceCounterResult,
} from "@/lib/live";

export interface UseLivePresenceResult {
  joined: boolean;
  loading: boolean;
  error: string;
  counters: LivePresenceCounterResult | null;
  joinRoom: () => Promise<void>;
  leaveRoom: () => Promise<void>;
}

export function useLivePresence(
  roomId: string | null | undefined,
): UseLivePresenceResult {
  const joinedRoomIdRef =
    useRef<string | null>(null);

  const leavingRef =
    useRef(false);

  const [joined, setJoined] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [counters, setCounters] =
    useState<LivePresenceCounterResult | null>(
      null,
    );

  const joinRoom = useCallback(async () => {
    if (!roomId) {
      return;
    }

    if (
      joinedRoomIdRef.current === roomId
    ) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result =
        await joinLiveRoom(roomId);

      joinedRoomIdRef.current =
        roomId;

      setJoined(true);
      setCounters(result);
    } catch (presenceError) {
      setError(
        presenceError instanceof Error
          ? presenceError.message
          : "No se pudo entrar a la sala LIVE.",
      );
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  const leaveRoom = useCallback(async () => {
    const targetRoomId =
      joinedRoomIdRef.current;

    if (
      !targetRoomId ||
      leavingRef.current
    ) {
      return;
    }

    leavingRef.current = true;

    try {
      const result =
        await leaveLiveRoom(
          targetRoomId,
        );

      setCounters(result);
    } catch (presenceError) {
      setError(
        presenceError instanceof Error
          ? presenceError.message
          : "No se pudo salir de la sala LIVE.",
      );
    } finally {
      joinedRoomIdRef.current = null;
      leavingRef.current = false;
      setJoined(false);
    }
  }, []);

  useEffect(() => {
    void joinRoom();

    return () => {
      void leaveRoom();
    };
  }, [
    joinRoom,
    leaveRoom,
  ]);

  return {
    joined,
    loading,
    error,
    counters,
    joinRoom,
    leaveRoom,
  };
}

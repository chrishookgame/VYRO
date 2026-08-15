"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  approveLiveGuestRequest,
  cancelLiveGuestRequest,
  declineLiveGuestRequest,
  getLiveGuestRequestsForRoom,
  requestLiveGuestAccess,
  type CreateLiveGuestRequestInput,
  type LiveGuestRequest,
} from "@/lib/live-guest-requests";

import { supabase } from "@/lib/supabase";

export interface UseLiveGuestRequestsResult {
  requests: LiveGuestRequest[];
  loading: boolean;
  connected: boolean;
  error: string;
  refresh: () => Promise<void>;
  requestAccess: (
    input: CreateLiveGuestRequestInput,
  ) => Promise<LiveGuestRequest>;
  cancelRequest: (
    requestId: string,
  ) => Promise<LiveGuestRequest>;
  approveRequest: (
    requestId: string,
  ) => Promise<LiveGuestRequest>;
  declineRequest: (
    requestId: string,
  ) => Promise<LiveGuestRequest>;
}

export function useLiveGuestRequests(
  roomId?: string | null,
): UseLiveGuestRequestsResult {
  const [
    requests,
    setRequests,
  ] = useState<LiveGuestRequest[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(Boolean(roomId));

  const [
    connected,
    setConnected,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const refresh = useCallback(
    async () => {
      if (!roomId) {
        setRequests([]);
        setLoading(false);
        setError("");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const nextRequests =
          await getLiveGuestRequestsForRoom(
            roomId,
          );

        setRequests(nextRequests);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "No se pudieron cargar las solicitudes Guest.",
        );
      } finally {
        setLoading(false);
      }
    },
    [roomId],
  );

  const requestAccess = useCallback(
    async (
      input: CreateLiveGuestRequestInput,
    ) => {
      const request =
        await requestLiveGuestAccess(input);

      await refresh();

      return request;
    },
    [refresh],
  );

  const cancelRequest = useCallback(
    async (
      requestId: string,
    ) => {
      const request =
        await cancelLiveGuestRequest(
          requestId,
        );

      await refresh();

      return request;
    },
    [refresh],
  );

  const approveRequest = useCallback(
    async (
      requestId: string,
    ) => {
      const request =
        await approveLiveGuestRequest(
          requestId,
        );

      await refresh();

      return request;
    },
    [refresh],
  );

  const declineRequest = useCallback(
    async (
      requestId: string,
    ) => {
      const request =
        await declineLiveGuestRequest(
          requestId,
        );

      await refresh();

      return request;
    },
    [refresh],
  );

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!roomId) {
      setConnected(false);
      return;
    }

    const channelName =
      `vyro-live-guest-requests-${roomId}-${crypto.randomUUID()}`;

    const channel =
      supabase.channel(channelName);

    channel.on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "live_guest_requests",
        filter: `room_id=eq.${roomId}`,
      },
      () => {
        void refresh();
      },
    );

    channel.subscribe(
      (status) => {
        setConnected(
          status === "SUBSCRIBED",
        );
      },
    );

    return () => {
      setConnected(false);

      void supabase.removeChannel(
        channel,
      );
    };
  }, [
    refresh,
    roomId,
  ]);

  return {
    requests,
    loading,
    connected,
    error,
    refresh,
    requestAccess,
    cancelRequest,
    approveRequest,
    declineRequest,
  };
}
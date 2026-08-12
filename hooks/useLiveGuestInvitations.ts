"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  acceptLiveGuestInvitation,
  cancelLiveGuestInvitation,
  createLiveGuestInvitation,
  declineLiveGuestInvitation,
  getReceivedLiveGuestInvitations,
  getSentLiveGuestInvitations,
  revokeLiveGuestInvitation,
  type CreateLiveGuestInvitationInput,
  type LiveGuestInvitation,
} from "@/lib/live-guest-invitations";

import { supabase } from "@/lib/supabase";

export interface UseLiveGuestInvitationsResult {
  received: LiveGuestInvitation[];
  sent: LiveGuestInvitation[];
  loading: boolean;
  connected: boolean;
  error: string;
  refresh: () => Promise<void>;
  sendInvitation: (
    input: CreateLiveGuestInvitationInput,
  ) => Promise<LiveGuestInvitation>;
  acceptInvitation: (
    invitationId: string,
  ) => Promise<LiveGuestInvitation>;
  declineInvitation: (
    invitationId: string,
  ) => Promise<LiveGuestInvitation>;
  cancelInvitation: (
    invitationId: string,
  ) => Promise<LiveGuestInvitation>;
  revokeInvitation: (
    invitationId: string,
  ) => Promise<LiveGuestInvitation>;
}

export function useLiveGuestInvitations():
  UseLiveGuestInvitationsResult {
  const [received, setReceived] =
    useState<LiveGuestInvitation[]>([]);

  const [sent, setSent] =
    useState<LiveGuestInvitation[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [connected, setConnected] =
    useState(false);

  const [error, setError] =
    useState("");

  const refresh = useCallback(
    async () => {
      setLoading(true);
      setError("");

      try {
        const [
          nextReceived,
          nextSent,
        ] = await Promise.all([
          getReceivedLiveGuestInvitations(),
          getSentLiveGuestInvitations(),
        ]);

        setReceived(nextReceived);
        setSent(nextSent);
      } catch (invitationError) {
        setError(
          invitationError instanceof Error
            ? invitationError.message
            : "No se pudieron cargar las invitaciones Guest.",
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const sendInvitation = useCallback(
    async (
      input: CreateLiveGuestInvitationInput,
    ) => {
      const invitation =
        await createLiveGuestInvitation(
          input,
        );

      await refresh();

      return invitation;
    },
    [refresh],
  );

  const acceptInvitation = useCallback(
    async (
      invitationId: string,
    ) => {
      const invitation =
        await acceptLiveGuestInvitation(
          invitationId,
        );

      await refresh();

      return invitation;
    },
    [refresh],
  );

  const declineInvitation = useCallback(
    async (
      invitationId: string,
    ) => {
      const invitation =
        await declineLiveGuestInvitation(
          invitationId,
        );

      await refresh();

      return invitation;
    },
    [refresh],
  );

  const cancelInvitation = useCallback(
    async (
      invitationId: string,
    ) => {
      const invitation =
        await cancelLiveGuestInvitation(
          invitationId,
        );

      await refresh();

      return invitation;
    },
    [refresh],
  );

  const revokeInvitation = useCallback(
    async (
      invitationId: string,
    ) => {
      const invitation =
        await revokeLiveGuestInvitation(
          invitationId,
        );

      await refresh();

      return invitation;
    },
    [refresh],
  );

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const channelName =
      `vyro-live-guest-invitations-${crypto.randomUUID()}`;

    const channel =
      supabase.channel(
        channelName,
      );

    channel.on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table:
          "live_guest_invitations",
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
  }, [refresh]);

  return {
    received,
    sent,
    loading,
    connected,
    error,
    refresh,
    sendInvitation,
    acceptInvitation,
    declineInvitation,
    cancelInvitation,
    revokeInvitation,
  };
}

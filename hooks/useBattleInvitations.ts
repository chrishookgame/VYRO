"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  acceptBattleInvitation,
  cancelBattleInvitation,
  createBattleInvitation,
  declineBattleInvitation,
  getReceivedBattleInvitations,
  getSentBattleInvitations,
  type BattleInvitation,
  type CreateBattleInvitationInput,
} from "@/lib/battle-invitations";

import { supabase } from "@/lib/supabase";

export interface UseBattleInvitationsResult {
  received: BattleInvitation[];
  sent: BattleInvitation[];
  loading: boolean;
  connected: boolean;
  error: string;
  refresh: () => Promise<void>;
  sendInvitation: (
    input: CreateBattleInvitationInput,
  ) => Promise<BattleInvitation>;
  acceptInvitation: (
    invitationId: string,
  ) => Promise<BattleInvitation>;
  declineInvitation: (
    invitationId: string,
  ) => Promise<BattleInvitation>;
  cancelInvitation: (
    invitationId: string,
  ) => Promise<BattleInvitation>;
}

export function useBattleInvitations():
  UseBattleInvitationsResult {
  const [received, setReceived] =
    useState<BattleInvitation[]>([]);

  const [sent, setSent] =
    useState<BattleInvitation[]>([]);

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
          getReceivedBattleInvitations(),
          getSentBattleInvitations(),
        ]);

        setReceived(nextReceived);
        setSent(nextSent);
      } catch (invitationError) {
        setError(
          invitationError instanceof Error
            ? invitationError.message
            : "No se pudieron cargar las invitaciones de batalla.",
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const sendInvitation = useCallback(
    async (
      input: CreateBattleInvitationInput,
    ) => {
      const invitation =
        await createBattleInvitation(
          input,
        );

      await refresh();

      return invitation;
    },
    [refresh],
  );

  const acceptInvitation =
    useCallback(
      async (
        invitationId: string,
      ) => {
        const invitation =
          await acceptBattleInvitation(
            invitationId,
          );

        await refresh();

        return invitation;
      },
      [refresh],
    );

  const declineInvitation =
    useCallback(
      async (
        invitationId: string,
      ) => {
        const invitation =
          await declineBattleInvitation(
            invitationId,
          );

        await refresh();

        return invitation;
      },
      [refresh],
    );

  const cancelInvitation =
    useCallback(
      async (
        invitationId: string,
      ) => {
        const invitation =
          await cancelBattleInvitation(
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
    const channel = supabase
      .channel(
        "vyro-battle-invitations",
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table:
            "live_battle_invitations",
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
  };
}

"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import type {
  LiveBattleState,
} from "@/components/live/battle";

import {
  getLiveBattleByRoom,
  type LiveBattleDetails,
} from "@/lib/live-battle";

export interface UseLiveBattleResult {
  battle: LiveBattleState | null;
  details: LiveBattleDetails | null;
  loading: boolean;
  error: string;
  refresh: () => Promise<void>;
}

function getCreatorName(
  fullName: string | null,
  username: string | null,
  fallbackId: string,
): string {
  return (
    fullName?.trim() ||
    username?.trim() ||
    `VYRO ${fallbackId.slice(0, 8).toUpperCase()}`
  );
}

function mapBattleStatus(
  status: LiveBattleDetails["battle"]["status"],
): LiveBattleState["status"] {
  if (status === "finished") {
    return "finished";
  }

  if (status === "active") {
    return "active";
  }

  return "waiting";
}

function mapBattleDetails(
  details: LiveBattleDetails,
): LiveBattleState {
  const {
    battle,
    scores,
    leftCreator,
    rightCreator,
  } = details;

  return {
    id: battle.id,
    roomId: battle.room_id,
    status: mapBattleStatus(
      battle.status,
    ),
    startedAt: battle.started_at,
    endsAt: battle.ends_at,
    left: {
      creatorId:
        battle.left_creator_id,
      creatorName: getCreatorName(
        leftCreator?.full_name ?? null,
        leftCreator?.username ?? null,
        battle.left_creator_id,
      ),
      score: Number(
        scores.left_score,
      ),
      giftCount:
        scores.left_gift_count,
      energy:
        scores.left_energy,
    },
    right: {
      creatorId:
        battle.right_creator_id,
      creatorName: getCreatorName(
        rightCreator?.full_name ?? null,
        rightCreator?.username ?? null,
        battle.right_creator_id,
      ),
      score: Number(
        scores.right_score,
      ),
      giftCount:
        scores.right_gift_count,
      energy:
        scores.right_energy,
    },
    winnerId:
      battle.winner_id,
  };
}

export function useLiveBattle(
  roomId: string | null | undefined,
  realtimeVersion = 0,
): UseLiveBattleResult {
  const [details, setDetails] =
    useState<LiveBattleDetails | null>(
      null,
    );

  const [battle, setBattle] =
    useState<LiveBattleState | null>(
      null,
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const refresh = useCallback(
    async () => {
      if (!roomId) {
        setDetails(null);
        setBattle(null);
        setLoading(false);
        setError("");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const nextDetails =
          await getLiveBattleByRoom(
            roomId,
          );

        setDetails(nextDetails);

        setBattle(
          nextDetails
            ? mapBattleDetails(
                nextDetails,
              )
            : null,
        );
      } catch (battleError) {
        setDetails(null);
        setBattle(null);

        setError(
          battleError instanceof Error
            ? battleError.message
            : "No se pudo cargar la batalla LIVE.",
        );
      } finally {
        setLoading(false);
      }
    },
    [roomId],
  );

  useEffect(() => {
    void realtimeVersion;
    void refresh();
  }, [realtimeVersion, refresh]);

  return {
    battle,
    details,
    loading,
    error,
    refresh,
  };
}

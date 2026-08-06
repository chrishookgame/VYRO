"use client";

import {
  useCallback,
  useMemo,
  useState,
} from "react";

import {
  createLiveLeaderboardEngine,
  getTopLeaderboardEntries,
  processLeaderboardGiftEvent,
  resetLiveLeaderboard,
  type LiveLeaderboardEngine,
  type LiveLeaderboardEntry,
  type LiveLeaderboardGiftEvent,
} from "@/components/live/leaderboard";

import type {
  LiveGiftSendResult,
} from "@/lib/live";

export interface UseLiveLeaderboardResult {
  entries: LiveLeaderboardEntry[];
  totalParticipants: number;
  updatedAt: number;
  registerGiftResult: (
    result: LiveGiftSendResult,
  ) => void;
  registerGiftEvent: (
    event: LiveLeaderboardGiftEvent,
  ) => void;
  resetLeaderboard: () => void;
}

function createGiftEventFromResult(
  result: LiveGiftSendResult,
): LiveLeaderboardGiftEvent {
  return {
    id: result.giftId,
    roomId: result.roomId,
    senderId: result.senderId,
    senderName: null,
    senderAvatarUrl: null,
    giftCode: result.giftType,
    giftName: result.giftName,
    amount: result.grossAmount,
    energy: result.energyAdded,
    createdAt: Date.now(),
  };
}

export function useLiveLeaderboard(
  roomId: string | null | undefined,
  limit = 10,
): UseLiveLeaderboardResult {
  const [
    engine,
    setEngine,
  ] = useState<LiveLeaderboardEngine>(
    () =>
      createLiveLeaderboardEngine(
        roomId ?? "",
      ),
  );

  const registerGiftEvent =
    useCallback(
      (
        event: LiveLeaderboardGiftEvent,
      ) => {
        if (
          !roomId ||
          event.roomId !== roomId
        ) {
          return;
        }

        setEngine(
          (currentEngine) => {
            const baseEngine =
              currentEngine.state.roomId ===
              roomId
                ? currentEngine
                : createLiveLeaderboardEngine(
                    roomId,
                  );

            return processLeaderboardGiftEvent(
              baseEngine,
              event,
            );
          },
        );
      },
      [roomId],
    );

  const registerGiftResult =
    useCallback(
      (
        result: LiveGiftSendResult,
      ) => {
        registerGiftEvent(
          createGiftEventFromResult(
            result,
          ),
        );
      },
      [registerGiftEvent],
    );

  const resetLeaderboard =
    useCallback(() => {
      setEngine(
        (currentEngine) =>
          resetLiveLeaderboard(
            currentEngine.state.roomId ===
              (roomId ?? "")
              ? currentEngine
              : createLiveLeaderboardEngine(
                  roomId ?? "",
                ),
          ),
      );
    }, [roomId]);

  const entries = useMemo(
    () =>
      getTopLeaderboardEntries(
        engine,
        limit,
      ),
    [
      engine,
      limit,
    ],
  );

  return {
    entries,
    totalParticipants:
      Object.keys(
        engine.state.entries,
      ).length,
    updatedAt:
      engine.state.updatedAt,
    registerGiftResult,
    registerGiftEvent,
    resetLeaderboard,
  };
}

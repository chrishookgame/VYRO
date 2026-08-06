"use client";

import {
  useCallback,
  useState,
} from "react";

import {
  sendLiveGift,
  type LiveGiftCatalogItem,
  type LiveGiftSendResult,
} from "@/lib/live";

export interface UseLiveGiftsResult {
  sending: boolean;
  error: string;
  lastSentGift: LiveGiftSendResult | null;
  sendGift: (
    gift: LiveGiftCatalogItem,
  ) => Promise<LiveGiftSendResult | null>;
  clearGiftError: () => void;
  clearLastSentGift: () => void;
}

export function useLiveGifts(
  roomId: string | null | undefined,
  onGiftSent?: (
    result: LiveGiftSendResult,
  ) => void | Promise<void>,
): UseLiveGiftsResult {
  const [sending, setSending] =
    useState(false);

  const [error, setError] =
    useState("");

  const [lastSentGift, setLastSentGift] =
    useState<LiveGiftSendResult | null>(
      null,
    );

  const clearGiftError =
    useCallback(() => {
      setError("");
    }, []);

  const clearLastSentGift =
    useCallback(() => {
      setLastSentGift(null);
    }, []);

  const sendGift = useCallback(
    async (
      gift: LiveGiftCatalogItem,
    ): Promise<LiveGiftSendResult | null> => {
      if (!roomId) {
        setError(
          "No existe una sala LIVE para enviar el regalo.",
        );

        return null;
      }

      setSending(true);
      setError("");

      try {
        const result =
          await sendLiveGift(
            roomId,
            gift.code,
          );

        setLastSentGift(result);

        await onGiftSent?.(result);

        return result;
      } catch (giftError) {
        setError(
          giftError instanceof Error
            ? giftError.message
            : "No se pudo enviar el regalo LIVE.",
        );

        return null;
      } finally {
        setSending(false);
      }
    },
    [
      onGiftSent,
      roomId,
    ],
  );

  return {
    sending,
    error,
    lastSentGift,
    sendGift,
    clearGiftError,
    clearLastSentGift,
  };
}

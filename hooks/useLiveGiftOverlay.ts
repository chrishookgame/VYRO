"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  LiveGiftRarity,
  LiveRealtimeUpdate,
} from "@/lib/live";

export interface LiveGiftOverlayItem {
  id: string;
  code: string;
  senderId: string | null;
  name: string;
  icon: string;
  rarity: LiveGiftRarity;
  animationKey: string;
  amount: number;
  creatorEarnings: number;
  energyAdded: number;
}

interface RealtimeEventRow {
  event_type?: unknown;
  payload?: unknown;
}

interface PostgresRealtimePayload {
  new?: unknown;
}

const rarityDurations: Record<
  LiveGiftRarity,
  number
> = {
  common: 2200,
  rare: 3200,
  epic: 4800,
  legendary: 6500,
  mythic: 9000,
};

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null
  );
}

function parseGiftEvent(
  update: LiveRealtimeUpdate | null,
): LiveGiftOverlayItem | null {
  if (
    !update ||
    update.type !== "event" ||
    !isRecord(update.payload)
  ) {
    return null;
  }

  const postgresPayload =
    update.payload as PostgresRealtimePayload;

  if (!isRecord(postgresPayload.new)) {
    return null;
  }

  const row =
    postgresPayload.new as RealtimeEventRow;

  if (
    row.event_type !== "gift_sent" ||
    !isRecord(row.payload)
  ) {
    return null;
  }

  const payload = row.payload;

  const giftId =
    typeof payload.gift_id === "string"
      ? payload.gift_id
      : null;

  const giftCode =
    typeof payload.gift_code === "string"
      ? payload.gift_code
      : null;

  const senderId =
    typeof payload.sender_id === "string"
      ? payload.sender_id
      : null;

  const giftName =
    typeof payload.gift_name === "string"
      ? payload.gift_name
      : null;

  const giftIcon =
    typeof payload.gift_icon === "string"
      ? payload.gift_icon
      : "🎁";

  const rarity =
    typeof payload.rarity === "string"
      ? payload.rarity
      : "common";

  const validRarities: LiveGiftRarity[] = [
    "common",
    "rare",
    "epic",
    "legendary",
    "mythic",
  ];

  if (
    !giftId ||
    !giftCode ||
    !giftName ||
    !validRarities.includes(
      rarity as LiveGiftRarity,
    )
  ) {
    return null;
  }

  return {
    id: giftId,
    code: giftCode,
    senderId,
    name: giftName,
    icon: giftIcon,
    rarity:
      rarity as LiveGiftRarity,
    animationKey:
      typeof payload.animation_key ===
      "string"
        ? payload.animation_key
        : giftCode,
    amount: Number(
      payload.amount ?? 0,
    ),
    creatorEarnings: Number(
      payload.creator_earnings ?? 0,
    ),
    energyAdded: Number(
      payload.energy_added ?? 0,
    ),
  };
}

export interface UseLiveGiftOverlayResult {
  activeGift: LiveGiftOverlayItem | null;
  queuedGifts: number;
  dismissActiveGift: () => void;
}

export function useLiveGiftOverlay(
  lastUpdate: LiveRealtimeUpdate | null,
): UseLiveGiftOverlayResult {
  const seenGiftIdsRef =
    useRef(new Set<string>());

  const [queue, setQueue] =
    useState<LiveGiftOverlayItem[]>([]);

  const activeGift =
    queue[0] ?? null;

  const parsedGift = useMemo(
    () => parseGiftEvent(lastUpdate),
    [lastUpdate],
  );

  useEffect(() => {
    if (
      !parsedGift ||
      seenGiftIdsRef.current.has(
        parsedGift.id,
      )
    ) {
      return;
    }

    seenGiftIdsRef.current.add(
      parsedGift.id,
    );

    setQueue((currentQueue) => [
      ...currentQueue,
      parsedGift,
    ]);
  }, [parsedGift]);

  useEffect(() => {
    if (!activeGift) {
      return;
    }

    const timeout = window.setTimeout(
      () => {
        setQueue((currentQueue) =>
          currentQueue.slice(1),
        );
      },
      activeGift.animationKey === "dragon"
        ? 21000
        : rarityDurations[
            activeGift.rarity
          ],
    );

    return () => {
      window.clearTimeout(timeout);
    };
  }, [activeGift]);

  function dismissActiveGift() {
    setQueue((currentQueue) =>
      currentQueue.slice(1),
    );
  }

  return {
    activeGift,
    queuedGifts: Math.max(
      queue.length - 1,
      0,
    ),
    dismissActiveGift,
  };
}

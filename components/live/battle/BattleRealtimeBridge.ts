import type {
  LiveRealtimeUpdate,
} from "@/lib/live";

import {
  battleGiftEngine,
  type BattleGiftEvent,
  type BattleGiftResult,
} from "./BattleGiftEngine";

import type {
  LiveBattleState,
} from "./LiveBattleEngine";

interface RealtimePayload {
  new?: unknown;
}

interface LiveGiftRealtimeRow {
  id?: unknown;
  gift_id?: unknown;
  room_id?: unknown;
  receiver_id?: unknown;
  gift_type?: unknown;
  gift_name?: unknown;
  gross_amount?: unknown;
  energy_added?: unknown;
  quantity?: unknown;
}

export interface BattleRealtimeBridgeResult
  extends BattleGiftResult {
  handled: boolean;
}

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function readString(
  value: unknown,
): string | null {
  return typeof value === "string" &&
    value.length > 0
    ? value
    : null;
}

function readNumber(
  value: unknown,
): number {
  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return value;
  }

  if (
    typeof value === "string" &&
    value.trim() !== ""
  ) {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return 0;
}

function getGiftRow(
  payload: unknown,
): LiveGiftRealtimeRow | null {
  if (!isRecord(payload)) {
    return null;
  }

  const realtimePayload =
    payload as RealtimePayload;

  if (!isRecord(realtimePayload.new)) {
    return null;
  }

  return realtimePayload.new;
}

function createUnhandledResult(
  battle: LiveBattleState,
): BattleRealtimeBridgeResult {
  return {
    battle,
    scoreAdded: 0,
    giftCountAdded: 0,
    energyAdded: 0,
    applied: false,
    handled: false,
  };
}

export function applyBattleRealtimeUpdate(
  battle: LiveBattleState,
  update: LiveRealtimeUpdate,
): BattleRealtimeBridgeResult {
  if (update.type !== "gift") {
    return createUnhandledResult(
      battle,
    );
  }

  const row =
    getGiftRow(update.payload);

  if (!row) {
    return createUnhandledResult(
      battle,
    );
  }

  const roomId =
    readString(row.room_id);

  const receiverId =
    readString(row.receiver_id);

  const giftId =
    readString(row.id) ??
    readString(row.gift_id);

  const giftCode =
    readString(row.gift_type);

  const giftName =
    readString(row.gift_name) ??
    giftCode;

  if (
    !roomId ||
    roomId !== battle.roomId ||
    !receiverId ||
    !giftId ||
    !giftCode ||
    !giftName
  ) {
    return createUnhandledResult(
      battle,
    );
  }

  const event: BattleGiftEvent = {
    giftId,
    battleId: battle.id,
    receiverId,
    giftCode,
    giftName,
    quantity: Math.max(
      1,
      Math.floor(
        readNumber(row.quantity) || 1,
      ),
    ),
    unitValue: Math.max(
      0,
      readNumber(row.gross_amount),
    ),
    energyValue: Math.max(
      0,
      readNumber(row.energy_added),
    ),
  };

  const result =
    battleGiftEngine.applyGift(
      battle,
      event,
    );

  return {
    ...result,
    handled: true,
  };
}

export class BattleRealtimeBridge {
  apply(
    battle: LiveBattleState,
    update: LiveRealtimeUpdate,
  ): BattleRealtimeBridgeResult {
    return applyBattleRealtimeUpdate(
      battle,
      update,
    );
  }
}

export const battleRealtimeBridge =
  new BattleRealtimeBridge();

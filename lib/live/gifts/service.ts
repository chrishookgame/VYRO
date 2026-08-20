import {
  getCurrentWalletBalance,
  getLiveGiftCatalog,
  getLiveGiftCategories,
  sendLiveGiftRecord,
} from "./repository";

import type {
  LiveGiftCatalogItem,
  LiveGiftCategory,
  LiveGiftSendResult,
} from "./types";

export async function loadGiftPickerData(): Promise<{
  categories: LiveGiftCategory[];
  gifts: LiveGiftCatalogItem[];
  balance: number;
}> {
  const [
    categories,
    gifts,
    balance,
  ] = await Promise.all([
    getLiveGiftCategories(),
    getLiveGiftCatalog(),
    getCurrentWalletBalance(),
  ]);

  return {
    categories,
    gifts,
    balance,
  };
}

export async function sendLiveGift(
  roomId: string,
  giftCode: string,
  receiverId?: string | null,
): Promise<LiveGiftSendResult> {
  if (!roomId) {
    throw new Error(
      "No existe una sala LIVE para enviar el regalo.",
    );
  }

  if (!giftCode) {
    throw new Error(
      "Selecciona un regalo antes de enviarlo.",
    );
  }

  return sendLiveGiftRecord(
    roomId,
    giftCode,
    receiverId,
  );
}

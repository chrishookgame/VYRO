import type {
  LiveGiftOverlayItem,
} from "@/hooks";

import {
  getGiftComboProgress,
  hasComboTierChanged,
} from "./ComboMultiplier";

import {
  createComboExpiration,
  defaultGiftComboConfiguration,
  isGiftComboExpired,
} from "./ComboTimer";

import type {
  GiftComboConfiguration,
  GiftComboState,
  GiftComboUpdateResult,
} from "./types";

function buildComboKey(
  gift: LiveGiftOverlayItem,
): string {
  return [
    gift.senderId ?? "anonymous",
    gift.code,
  ].join(":");
}

export function createGiftCombo(
  gift: LiveGiftOverlayItem,
  configuration: GiftComboConfiguration =
    defaultGiftComboConfiguration,
  currentTime = Date.now(),
): GiftComboState {
  const progress =
    getGiftComboProgress(1);

  return {
    comboKey: buildComboKey(gift),
    giftCode: gift.code,
    senderId: gift.senderId ?? null,
    count: 1,
    totalAmount: gift.amount,
    totalEnergy: gift.energyAdded,
    multiplier: progress.multiplier,
    tier: progress.tier,
    startedAt: currentTime,
    updatedAt: currentTime,
    expiresAt: createComboExpiration(
      currentTime,
      configuration.windowMs,
    ),
    lastGift: gift,
  };
}

export function updateGiftCombo(
  currentCombo: GiftComboState | null,
  gift: LiveGiftOverlayItem,
  configuration: GiftComboConfiguration =
    defaultGiftComboConfiguration,
  currentTime = Date.now(),
): GiftComboUpdateResult {
  const comboKey =
    buildComboKey(gift);

  const shouldCreateNewCombo =
    !currentCombo ||
    currentCombo.comboKey !== comboKey ||
    isGiftComboExpired(
      currentCombo,
      currentTime,
    );

  if (shouldCreateNewCombo) {
    return {
      combo: createGiftCombo(
        gift,
        configuration,
        currentTime,
      ),
      created: true,
      upgraded: false,
    };
  }

  const nextCount = Math.min(
    currentCombo.count + 1,
    configuration.maximumCount,
  );

  const progress =
    getGiftComboProgress(nextCount);

  return {
    combo: {
      ...currentCombo,
      count: nextCount,
      totalAmount:
        currentCombo.totalAmount +
        gift.amount,
      totalEnergy:
        currentCombo.totalEnergy +
        gift.energyAdded,
      multiplier:
        progress.multiplier,
      tier:
        progress.tier,
      updatedAt:
        currentTime,
      expiresAt:
        createComboExpiration(
          currentTime,
          configuration.windowMs,
        ),
      lastGift:
        gift,
    },
    created: false,
    upgraded:
      hasComboTierChanged(
        currentCombo.count,
        nextCount,
      ),
  };
}

export function resetGiftCombo(): null {
  return null;
}

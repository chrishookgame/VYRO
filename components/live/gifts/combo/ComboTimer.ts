import type {
  GiftComboConfiguration,
  GiftComboState,
} from "./types";

export const defaultGiftComboConfiguration: GiftComboConfiguration = {
  windowMs: 5000,
  maximumCount: 1000,
};

export function createComboExpiration(
  currentTime = Date.now(),
  windowMs =
    defaultGiftComboConfiguration.windowMs,
): number {
  return (
    currentTime +
    Math.max(windowMs, 0)
  );
}

export function getComboRemainingTime(
  combo: GiftComboState,
  currentTime = Date.now(),
): number {
  return Math.max(
    combo.expiresAt -
      currentTime,
    0,
  );
}

export function isGiftComboExpired(
  combo: GiftComboState,
  currentTime = Date.now(),
): boolean {
  return (
    getComboRemainingTime(
      combo,
      currentTime,
    ) === 0
  );
}

export function refreshGiftComboExpiration(
  combo: GiftComboState,
  currentTime = Date.now(),
  windowMs =
    defaultGiftComboConfiguration.windowMs,
): GiftComboState {
  return {
    ...combo,
    updatedAt: currentTime,
    expiresAt:
      createComboExpiration(
        currentTime,
        windowMs,
      ),
  };
}

import type {
  LiveGiftOverlayItem,
} from "@/hooks";

export type GiftComboTier =
  | "starter"
  | "boost"
  | "super"
  | "mega"
  | "ultra"
  | "mythic";

export interface GiftComboState {
  comboKey: string;
  giftCode: string;
  senderId: string | null;
  count: number;
  totalAmount: number;
  totalEnergy: number;
  multiplier: number;
  tier: GiftComboTier;
  startedAt: number;
  updatedAt: number;
  expiresAt: number;
  lastGift: LiveGiftOverlayItem;
}

export interface GiftComboConfiguration {
  windowMs: number;
  maximumCount: number;
}

export interface GiftComboProgress {
  count: number;
  multiplier: number;
  tier: GiftComboTier;
  progressToNextTier: number;
  nextTierAt: number | null;
}

export interface GiftComboUpdateResult {
  combo: GiftComboState;
  created: boolean;
  upgraded: boolean;
}

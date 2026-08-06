import type {
  GiftComboTier,
} from "../types";

export type ComboShakeIntensity =
  | "none"
  | "soft"
  | "medium"
  | "strong";

export type ComboFlashIntensity =
  | "none"
  | "soft"
  | "medium"
  | "strong";

export interface ComboEffectConfiguration {
  tier: GiftComboTier;
  shake: ComboShakeIntensity;
  flash: ComboFlashIntensity;
  particleCount: number;
  particleSymbols: string[];
  shockwaveCount: number;
}

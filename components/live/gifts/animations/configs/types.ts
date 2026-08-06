import type {
  LiveGiftRarity,
} from "@/lib/live";

export type GiftCameraShake =
  | "none"
  | "soft"
  | "medium"
  | "strong";

export type GiftFlashIntensity =
  | "none"
  | "soft"
  | "medium"
  | "strong";

export interface GiftAudioConfiguration {
  soundKey: string;
  volume: number;
  pitch: number;
}

export interface GiftParticleConfiguration {
  symbols: string[];
  count: number;
  preset: string;
}

export interface GiftVisualConfiguration {
  glowClassName: string;
  flashIntensity: GiftFlashIntensity;
  cameraShake: GiftCameraShake;
  fullScreen: boolean;
}

export interface GiftAnimationConfiguration {
  animationKey: string;
  rarity: LiveGiftRarity;
  durationMs: number;
  audio: GiftAudioConfiguration;
  particles: GiftParticleConfiguration;
  visual: GiftVisualConfiguration;
}

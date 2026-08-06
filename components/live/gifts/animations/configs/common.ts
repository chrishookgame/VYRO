import type {
  GiftAnimationConfiguration,
} from "./types";

export const defaultGiftConfiguration: GiftAnimationConfiguration = {
  animationKey: "default",
  rarity: "common",
  durationMs: 2200,

  audio: {
    soundKey: "vyro_default",
    volume: 0.08,
    pitch: 1,
  },

  particles: {
    symbols: ["✨", "⚡"],
    count: 16,
    preset: "sparkle",
  },

  visual: {
    glowClassName: "bg-cyan-300/10",
    flashIntensity: "soft",
    cameraShake: "none",
    fullScreen: false,
  },
};

export const commonGiftConfigurations: Record<
  string,
  GiftAnimationConfiguration
> = {
  rose: {
    animationKey: "rose",
    rarity: "common",
    durationMs: 2400,

    audio: {
      soundKey: "vyro_rose",
      volume: 0.07,
      pitch: 1.08,
    },

    particles: {
      symbols: ["🌹", "🌸", "✨"],
      count: 24,
      preset: "petals",
    },

    visual: {
      glowClassName: "bg-rose-300/15",
      flashIntensity: "soft",
      cameraShake: "none",
      fullScreen: false,
    },
  },

  heart: {
    animationKey: "heart",
    rarity: "common",
    durationMs: 2600,

    audio: {
      soundKey: "vyro_heart",
      volume: 0.08,
      pitch: 1.12,
    },

    particles: {
      symbols: ["❤️", "💖", "💕"],
      count: 26,
      preset: "hearts",
    },

    visual: {
      glowClassName: "bg-pink-300/15",
      flashIntensity: "soft",
      cameraShake: "none",
      fullScreen: false,
    },
  },

  diamond: {
    animationKey: "diamond",
    rarity: "epic",
    durationMs: 4800,

    audio: {
      soundKey: "vyro_diamond",
      volume: 0.12,
      pitch: 1.18,
    },

    particles: {
      symbols: ["💎", "✦", "✨"],
      count: 32,
      preset: "crystal",
    },

    visual: {
      glowClassName: "bg-cyan-200/20",
      flashIntensity: "medium",
      cameraShake: "soft",
      fullScreen: false,
    },
  },
};

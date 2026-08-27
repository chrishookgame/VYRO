import type {
  GiftAnimationConfiguration,
} from "./types";

export const extendedGiftConfigurations: Record<
  string,
  GiftAnimationConfiguration
> = {
  phoenix: {
    animationKey: "phoenix",
    rarity: "epic",
    durationMs: 6200,

    audio: {
      soundKey: "phoenix",
      volume: 0.15,
      pitch: 0.92,
    },

    particles: {
      symbols: ["🔥", "✨", "⚡"],
      count: 38,
      preset: "phoenix_fire",
    },

    visual: {
      glowClassName:
        "bg-orange-300/20",
      flashIntensity: "medium",
      cameraShake: "soft",
      fullScreen: false,
    },
  },

  galaxy: {
    animationKey: "galaxy",
    rarity: "legendary",
    durationMs: 7800,

    audio: {
      soundKey: "galaxy",
      volume: 0.17,
      pitch: 0.86,
    },

    particles: {
      symbols: ["🌌", "⭐", "✨"],
      count: 44,
      preset: "galaxy_explosion",
    },

    visual: {
      glowClassName:
        "bg-violet-300/25",
      flashIntensity: "medium",
      cameraShake: "medium",
      fullScreen: false,
    },
  },

  universe: {
    animationKey: "universe",
    rarity: "mythic",
    durationMs: 12000,

    audio: {
      soundKey: "vyro_universe",
      volume: 0.22,
      pitch: 0.78,
    },

    particles: {
      symbols: ["🪐", "🌌", "✨", "⭐"],
      count: 48,
      preset: "vyro_cosmos",
    },

    visual: {
      glowClassName:
        "bg-fuchsia-300/25",
      flashIntensity: "strong",
      cameraShake: "medium",
      fullScreen: false,
    },
  },
};
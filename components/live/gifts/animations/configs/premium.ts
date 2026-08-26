import type {
  GiftAnimationConfiguration,
} from "./types";

export const premiumGiftConfigurations: Record<
  string,
  GiftAnimationConfiguration
> = {
  crown: {
    animationKey: "crown",
    rarity: "legendary",
    durationMs: 6500,

    audio: {
      soundKey: "vyro_crown",
      volume: 0.16,
      pitch: 0.95,
    },

    particles: {
      symbols: ["👑", "✦", "✨"],
      count: 40,
      preset: "royal_gold",
    },

    visual: {
      glowClassName: "bg-yellow-300/20",
      flashIntensity: "medium",
      cameraShake: "soft",
      fullScreen: true,
    },
  },

  dragon: {
    animationKey: "dragon",
    rarity: "mythic",
    durationMs: 21000,

    audio: {
      soundKey: "vyro_dragon",
      volume: 0.2,
      pitch: 0.82,
    },

    particles: {
      symbols: ["🐉", "🔥", "✦"],
      count: 54,
      preset: "dragon_fire",
    },

    visual: {
      glowClassName: "bg-orange-400/20",
      flashIntensity: "strong",
      cameraShake: "strong",
      fullScreen: true,
    },
  },

  golden_palace: {
    animationKey: "golden_palace",
    rarity: "mythic",
    durationMs: 8000,

    audio: {
      soundKey: "vyro_golden_palace",
      volume: 0.18,
      pitch: 0.9,
    },

    particles: {
      symbols: ["🏰", "✨", "🟡"],
      count: 60,
      preset: "royal_palace",
    },

    visual: {
      glowClassName: "bg-amber-300/25",
      flashIntensity: "strong",
      cameraShake: "medium",
      fullScreen: true,
    },
  },

  space_shuttle: {
    animationKey: "space_shuttle",
    rarity: "mythic",
    durationMs: 10000,

    audio: {
      soundKey: "vyro_space_shuttle",
      volume: 0.2,
      pitch: 0.86,
    },

    particles: {
      symbols: ["🚀", "🔥", "⭐"],
      count: 64,
      preset: "space_launch",
    },

    visual: {
      glowClassName: "bg-sky-300/20",
      flashIntensity: "strong",
      cameraShake: "strong",
      fullScreen: true,
    },
  },

  vyro_universe: {
    animationKey: "vyro_universe",
    rarity: "mythic",
    durationMs: 12000,

    audio: {
      soundKey: "vyro_universe",
      volume: 0.22,
      pitch: 0.78,
    },

    particles: {
      symbols: ["🪐", "🌌", "✨", "⭐"],
      count: 80,
      preset: "vyro_cosmos",
    },

    visual: {
      glowClassName: "bg-fuchsia-300/25",
      flashIntensity: "strong",
      cameraShake: "medium",
      fullScreen: true,
    },
  },
};

"use client";

import type {
  GiftComboTier,
} from "../types";

import CameraShake from "./CameraShake";
import FlashEffect from "./FlashEffect";
import ParticleBurst from "./ParticleBurst";
import Shockwave from "./Shockwave";

import type {
  ComboEffectConfiguration,
} from "./types";

interface ComboEffectsProps {
  tier: GiftComboTier;
  visible?: boolean;
}

const comboEffectConfigurations: Record<
  GiftComboTier,
  ComboEffectConfiguration
> = {
  starter: {
    tier: "starter",
    shake: "none",
    flash: "none",
    particleCount: 10,
    particleSymbols: ["✨"],
    shockwaveCount: 0,
  },

  boost: {
    tier: "boost",
    shake: "soft",
    flash: "soft",
    particleCount: 18,
    particleSymbols: ["✨", "⚡"],
    shockwaveCount: 1,
  },

  super: {
    tier: "super",
    shake: "soft",
    flash: "medium",
    particleCount: 26,
    particleSymbols: ["💫", "⚡", "✨"],
    shockwaveCount: 1,
  },

  mega: {
    tier: "mega",
    shake: "medium",
    flash: "medium",
    particleCount: 36,
    particleSymbols: ["💥", "💫", "⚡"],
    shockwaveCount: 2,
  },

  ultra: {
    tier: "ultra",
    shake: "strong",
    flash: "strong",
    particleCount: 48,
    particleSymbols: ["🔥", "💥", "✨", "⚡"],
    shockwaveCount: 3,
  },

  mythic: {
    tier: "mythic",
    shake: "strong",
    flash: "strong",
    particleCount: 64,
    particleSymbols: ["🌌", "🔥", "💥", "⚡", "✨"],
    shockwaveCount: 4,
  },
};

export function getComboEffectConfiguration(
  tier: GiftComboTier,
): ComboEffectConfiguration {
  return comboEffectConfigurations[tier];
}

export default function ComboEffects({
  tier,
  visible = true,
}: ComboEffectsProps) {
  if (!visible) {
    return null;
  }

  const configuration =
    getComboEffectConfiguration(tier);

  return (
    <CameraShake
      intensity={
        configuration.shake
      }
    >
      <FlashEffect
        intensity={
          configuration.flash
        }
      />

      <ParticleBurst
        symbols={
          configuration.particleSymbols
        }
        count={
          configuration.particleCount
        }
      />

      <Shockwave
        count={
          configuration.shockwaveCount
        }
      />
    </CameraShake>
  );
}

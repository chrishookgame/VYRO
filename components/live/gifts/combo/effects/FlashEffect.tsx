"use client";

import type {
  ComboFlashIntensity,
} from "./types";

interface FlashEffectProps {
  intensity?: ComboFlashIntensity;
}

const intensityStyles: Record<
  ComboFlashIntensity,
  string
> = {
  none: "hidden",
  soft: "bg-white/5",
  medium: "bg-white/10",
  strong: "bg-white/20",
};

export default function FlashEffect({
  intensity = "none",
}: FlashEffectProps) {
  return (
    <div
      aria-hidden="true"
      data-vyro-combo-flash={
        intensity
      }
      className={`pointer-events-none fixed inset-0 z-[96] animate-pulse ${intensityStyles[intensity]}`}
    />
  );
}

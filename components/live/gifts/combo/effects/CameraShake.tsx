"use client";

import type {
  PropsWithChildren,
} from "react";

import type {
  ComboShakeIntensity,
} from "./types";

interface CameraShakeProps
  extends PropsWithChildren {
  intensity?: ComboShakeIntensity;
}

const intensityStyles: Record<
  ComboShakeIntensity,
  string
> = {
  none: "",
  soft: "animate-pulse",
  medium:
    "animate-[pulse_0.6s_ease-in-out_2]",
  strong:
    "animate-[bounce_0.5s_ease-in-out_2]",
};

export default function CameraShake({
  intensity = "none",
  children,
}: CameraShakeProps) {
  return (
    <div
      data-vyro-camera-shake={
        intensity
      }
      className={
        intensityStyles[intensity]
      }
    >
      {children}
    </div>
  );
}

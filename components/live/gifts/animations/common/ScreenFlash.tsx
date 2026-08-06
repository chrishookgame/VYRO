"use client";

interface ScreenFlashProps {
  intensity?: "soft" | "medium" | "strong";
}

const intensityStyles = {
  soft: "bg-white/5",
  medium: "bg-white/10",
  strong: "bg-white/20",
};

export default function ScreenFlash({
  intensity = "soft",
}: ScreenFlashProps) {
  return (
    <div
      className={`absolute inset-0 animate-pulse ${intensityStyles[intensity]}`}
    />
  );
}

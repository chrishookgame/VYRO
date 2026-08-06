"use client";

interface GlowEffectProps {
  className?: string;
}

export default function GlowEffect({
  className = "",
}: GlowEffectProps) {
  return (
    <>
      <div
        className={`absolute -left-20 -top-20 h-56 w-56 animate-pulse rounded-full bg-white/10 blur-3xl ${className}`}
      />

      <div
        className={`absolute -bottom-20 -right-20 h-56 w-56 animate-pulse rounded-full bg-cyan-300/10 blur-3xl ${className}`}
      />
    </>
  );
}

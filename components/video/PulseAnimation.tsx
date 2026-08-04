"use client";

type PulseAnimationProps = {
  show: boolean;
};

export default function PulseAnimation({
  show,
}: PulseAnimationProps) {
  if (!show) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-32 w-32 animate-ping rounded-full bg-cyan-400/20" />

        <div
          className="absolute h-24 w-24 animate-ping rounded-full bg-cyan-300/30"
          style={{ animationDelay: "150ms" }}
        />

        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cyan-500/80 shadow-[0_0_40px_rgba(6,182,212,0.8)]">
          <span className="text-3xl text-white">❤</span>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Heart } from "lucide-react";

type LikeAnimationProps = {
  show: boolean;
};

export default function LikeAnimation({
  show,
}: LikeAnimationProps) {
  if (!show) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center animate-pulse">

      <Heart
        size={120}
        className="fill-cyan-400 text-cyan-300 drop-shadow-[0_0_30px_#00ffff]"
      />

    </div>
  );
}
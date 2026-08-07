"use client";

import {
  Flame,
  Trophy,
} from "lucide-react";

interface VyroWinStreakCelebrationProps {
  creatorName: string;
  streak: number;
  intensity: "standard" | "epic" | "legendary";
}

export default function VyroWinStreakCelebration({
  creatorName,
  streak,
  intensity,
}: VyroWinStreakCelebrationProps) {
  return (
    <section className="rounded-[2rem] border border-orange-300/20 bg-[linear-gradient(145deg,#211006,#0B0B10)] p-6">
      <div className="flex items-center gap-2 text-orange-200">
        <Flame
          size={20}
          className={
            intensity === "legendary"
              ? "animate-pulse"
              : ""
          }
        />

        <p className="text-xs font-black uppercase tracking-[0.24em]">
          VYRO WIN STREAK
        </p>
      </div>

      <div className="mt-5 flex items-center gap-4">
        <Trophy
          size={36}
          className="text-yellow-300"
        />

        <div>
          <h2 className="text-2xl font-black text-white">
            ¡{creatorName} está imparable!
          </h2>

          <p className="mt-1 text-lg font-black text-orange-200">
            {streak} victorias consecutivas
          </p>
        </div>
      </div>
    </section>
  );
}

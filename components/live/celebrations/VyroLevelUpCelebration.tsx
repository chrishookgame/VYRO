"use client";

import {
  Sparkles,
  Star,
} from "lucide-react";

interface VyroLevelUpCelebrationProps {
  creatorName: string;
  levelName: string;
  intensity: "standard" | "epic" | "legendary";
}

export default function VyroLevelUpCelebration({
  creatorName,
  levelName,
  intensity,
}: VyroLevelUpCelebrationProps) {
  return (
    <section className="rounded-[2rem] border border-cyan-300/20 bg-[linear-gradient(145deg,#071823,#0B0B12)] p-6">
      <div className="flex items-center gap-2 text-cyan-200">
        <Sparkles size={20} />

        <p className="text-xs font-black uppercase tracking-[0.24em]">
          VYRO LEVEL UP
        </p>
      </div>

      <div className="mt-5 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10">
          <Star
            size={28}
            className={
              intensity === "legendary"
                ? "animate-pulse text-yellow-200"
                : "text-cyan-200"
            }
          />
        </div>

        <div>
          <h2 className="text-2xl font-black text-white">
            ¡{creatorName} subió de nivel!
          </h2>

          <p className="mt-1 text-lg font-black text-cyan-200">
            {levelName}
          </p>
        </div>
      </div>
    </section>
  );
}

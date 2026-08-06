"use client";

import { Crown, Sparkles, Trophy } from "lucide-react";

interface BattleWinnerAnimationProps {
  winnerName: string;
  visible: boolean;
}

export default function BattleWinnerAnimation({
  winnerName,
  visible,
}: BattleWinnerAnimationProps) {
  if (!visible) {
    return null;
  }

  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[2rem] border border-yellow-400/30 bg-gradient-to-b from-[#1a1a1a] to-[#050505] p-10 text-center shadow-2xl animate-pulse">

        <Sparkles
          size={42}
          className="mx-auto text-yellow-300"
        />

        <p className="mt-4 text-xs font-black uppercase tracking-[0.35em] text-yellow-300">
          Battle Winner
        </p>

        <Trophy
          size={72}
          className="mx-auto mt-6 text-yellow-400"
        />

        <h2 className="mt-6 text-5xl font-black text-white">
          {winnerName}
        </h2>

        <div className="mt-5 flex items-center justify-center gap-3 text-yellow-300">
          <Crown size={26} />
          <span className="text-xl font-black">
            Victoria
          </span>
          <Crown size={26} />
        </div>

        <p className="mt-6 text-gray-300">
          ¡La batalla ha terminado!
        </p>
      </div>
    </section>
  );
}

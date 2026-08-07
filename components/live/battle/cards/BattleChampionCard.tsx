"use client";

import {
  Crown,
} from "lucide-react";

interface BattleChampionCardProps {
  winnerName: string;
  finalScore: string;
}

export default function BattleChampionCard({
  winnerName,
  finalScore,
}: BattleChampionCardProps) {
  return (
    <article className="rounded-[2rem] border border-yellow-300/20 bg-[linear-gradient(145deg,#201406,#0A0A10)] p-6">
      <Crown
        size={30}
        className="text-yellow-300"
      />

      <p className="mt-4 text-xs font-black uppercase tracking-[0.22em] text-yellow-200/60">
        Champion
      </p>

      <h3 className="mt-2 text-3xl font-black text-white">
        {winnerName}
      </h3>

      <p className="mt-4 text-lg font-black text-yellow-200">
        {finalScore}
      </p>
    </article>
  );
}

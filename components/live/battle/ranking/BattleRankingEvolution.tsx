"use client";

import {
  ChartNoAxesCombined,
  Flame,
} from "lucide-react";

import BattleRankingCard from "./BattleRankingCard";

import type {
  BattleRankingEvolutionData,
} from "./types";

interface BattleRankingEvolutionProps {
  data: BattleRankingEvolutionData;
}

export default function BattleRankingEvolution({
  data,
}: BattleRankingEvolutionProps) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-cyan-300/15 bg-[#071018]">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-6 py-5">
        <div>
          <div className="flex items-center gap-2 text-cyan-200">
            <ChartNoAxesCombined size={20} />

            <p className="text-xs font-black uppercase tracking-[0.24em]">
              VYRO Ranking Evolution
            </p>
          </div>

          <h2 className="mt-2 text-2xl font-black text-white">
            Evolución competitiva
          </h2>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-orange-300/15 bg-orange-300/[0.05] px-4 py-2 text-xs font-black text-orange-200/70">
          <Flame size={15} />

          Battle Weight {data.battleWeight}
        </div>
      </header>

      <div className="grid gap-4 p-5 lg:grid-cols-2">
        {data.left ? (
          <BattleRankingCard
            creator={data.left}
            leader={
              data.leader?.creatorId ===
              data.left.creatorId
            }
          />
        ) : null}

        {data.right ? (
          <BattleRankingCard
            creator={data.right}
            leader={
              data.leader?.creatorId ===
              data.right.creatorId
            }
          />
        ) : null}
      </div>

      <footer className="border-t border-white/10 px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-white/35">
        Intensity Bonus: +{data.intensityBonus}
      </footer>
    </section>
  );
}

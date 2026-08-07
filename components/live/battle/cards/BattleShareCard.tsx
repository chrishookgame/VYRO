"use client";

import {
  Share2,
  Sparkles,
} from "lucide-react";

import BattleChampionCard from "./BattleChampionCard";
import BattleMVPCard from "./BattleMVPCard";

import type {
  BattleShareCardData,
} from "./types";

interface BattleShareCardProps {
  data: BattleShareCardData;
}

export default function BattleShareCard({
  data,
}: BattleShareCardProps) {
  return (
    <section className="overflow-hidden rounded-[2.25rem] border border-cyan-300/15 bg-[#070B12]">
      <header className="border-b border-white/10 px-6 py-6">
        <div className="flex items-center gap-2 text-cyan-200">
          <Share2 size={20} />

          <p className="text-xs font-black uppercase tracking-[0.24em]">
            VYRO Shareable Battle Card
          </p>
        </div>

        <h2 className="mt-4 text-3xl font-black text-white">
          {data.title}
        </h2>

        <p className="mt-2 text-sm leading-6 text-white/50">
          {data.subtitle}
        </p>
      </header>

      <div className="grid gap-4 p-5 lg:grid-cols-2">
        <BattleChampionCard
          winnerName={
            data.winnerName
          }
          finalScore={
            data.finalScore
          }
        />

        <BattleMVPCard
          mvpName={
            data.mvpName
          }
        />
      </div>

      <div className="border-t border-white/10 p-5">
        <div className="flex items-center gap-2 text-yellow-200">
          <Sparkles size={18} />

          <p className="font-black">
            Highlights
          </p>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {data.highlights.map(
            (
              highlight,
              index,
            ) => (
              <div
                key={`${index}:${highlight}`}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm font-bold text-white/55"
              >
                {highlight}
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

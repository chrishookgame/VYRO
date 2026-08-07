"use client";

import {
  Landmark,
  Trophy,
} from "lucide-react";

import VyroHallOfFameCard from "./VyroHallOfFameCard";

import type {
  VyroHallOfFameData,
} from "./types";

interface VyroHallOfFameProps {
  data: VyroHallOfFameData;
}

export default function VyroHallOfFame({
  data,
}: VyroHallOfFameProps) {
  return (
    <section className="overflow-hidden rounded-[2.25rem] border border-yellow-300/20 bg-[linear-gradient(145deg,#151006,#080A10)]">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-6 py-6">
        <div>
          <div className="flex items-center gap-2 text-yellow-200">
            <Landmark size={21} />

            <p className="text-xs font-black uppercase tracking-[0.24em]">
              VYRO Hall of Fame
            </p>
          </div>

          <h2 className="mt-2 text-3xl font-black text-white">
            Legado competitivo
          </h2>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-yellow-300/15 bg-yellow-300/[0.05] px-4 py-2 text-xs font-black text-yellow-200/70">
          <Trophy size={15} />

          {data.totalLegends} Legends
        </div>
      </header>

      <div className="grid gap-4 p-5 lg:grid-cols-2">
        {data.entries.map(
          (entry) => (
            <VyroHallOfFameCard
              key={entry.creatorId}
              entry={entry}
              leader={
                data.leader?.creatorId ===
                entry.creatorId
              }
            />
          ),
        )}
      </div>
    </section>
  );
}

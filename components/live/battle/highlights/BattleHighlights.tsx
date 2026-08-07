"use client";

import {
  Sparkles,
} from "lucide-react";

import BattleHighlightCard from "./BattleHighlightCard";

import type {
  BattleHighlight,
} from "./types";

interface BattleHighlightsProps {
  highlights: BattleHighlight[];
}

export default function BattleHighlights({
  highlights,
}: BattleHighlightsProps) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-yellow-300/15 bg-[#0B0D13]">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-6 py-5">
        <div>
          <div className="flex items-center gap-2 text-yellow-200">
            <Sparkles size={20} />

            <p className="text-xs font-black uppercase tracking-[0.24em]">
              Battle Highlights
            </p>
          </div>

          <h2 className="mt-2 text-2xl font-black text-white">
            Momentos destacados
          </h2>
        </div>

        <span className="rounded-full border border-yellow-300/15 bg-yellow-300/[0.06] px-4 py-2 text-xs font-black text-yellow-100/60">
          {highlights.length} highlights
        </span>
      </header>

      <div className="grid gap-4 p-5 lg:grid-cols-2">
        {highlights.length > 0 ? (
          highlights.map(
            (highlight) => (
              <BattleHighlightCard
                key={highlight.id}
                highlight={highlight}
              />
            ),
          )
        ) : (
          <div className="lg:col-span-2 rounded-2xl border border-dashed border-white/10 p-8 text-center">
            <p className="font-bold text-white/40">
              Los momentos destacados aparecerán automáticamente durante la Battle Series.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

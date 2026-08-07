"use client";

import {
  Crown,
  Flame,
  Star,
} from "lucide-react";

import type {
  BattleHistoryEntry,
} from "./types";

interface BattleHistoryItemProps {
  entry: BattleHistoryEntry;
}

export default function BattleHistoryItem({
  entry,
}: BattleHistoryItemProps) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200/60">
            {entry.title}
          </p>

          <h3 className="mt-2 text-xl font-black text-white">
            {entry.winnerName
              ? `${entry.winnerName} ganó la batalla`
              : "Batalla finalizada"}
          </h3>
        </div>

        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-black text-white/40">
          {entry.finalScore}
        </span>
      </div>

      <p className="mt-3 text-sm leading-6 text-white/50">
        {entry.summary}
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
          <Crown size={16} className="text-yellow-200" />
          <p className="mt-2 text-xs text-white/35">Campeón</p>
          <p className="mt-1 font-black text-white">
            {entry.winnerName ?? "Sin campeón"}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
          <Star size={16} className="text-fuchsia-200" />
          <p className="mt-2 text-xs text-white/35">MVP</p>
          <p className="mt-1 font-black text-white">
            {entry.mvpName ?? "Por determinar"}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
          <Flame size={16} className="text-orange-200" />
          <p className="mt-2 text-xs text-white/35">Intensidad</p>
          <p className="mt-1 font-black text-white">
            {entry.intensity}%
          </p>
        </div>
      </div>
    </article>
  );
}

"use client";

import {
  History,
} from "lucide-react";

import BattleHistoryItem from "./BattleHistoryItem";

import type {
  BattleHistoryEntry,
} from "./types";

interface BattleHistoryProps {
  entries: BattleHistoryEntry[];
}

export default function BattleHistory({
  entries,
}: BattleHistoryProps) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-cyan-300/15 bg-[#071019]">
      <header className="border-b border-white/10 px-6 py-5">
        <div className="flex items-center gap-2 text-cyan-200">
          <History size={20} />

          <p className="text-xs font-black uppercase tracking-[0.24em]">
            VYRO Battle History
          </p>
        </div>

        <h2 className="mt-2 text-2xl font-black text-white">
          Historial de batalla
        </h2>
      </header>

      <div className="space-y-4 p-5">
        {entries.length > 0 ? (
          entries.map((entry) => (
            <BattleHistoryItem
              key={entry.id}
              entry={entry}
            />
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">
            <p className="font-bold text-white/40">
              El historial aparecerá cuando existan datos de la Battle Series.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

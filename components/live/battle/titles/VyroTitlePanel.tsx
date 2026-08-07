"use client";

import {
  Crown,
} from "lucide-react";

import VyroTitleBadge from "./VyroTitleBadge";
import VyroTitleChange from "./VyroTitleChange";

import type {
  VyroTitlesState,
} from "./types";

interface VyroTitlePanelProps {
  state: VyroTitlesState;
}

export default function VyroTitlePanel({
  state,
}: VyroTitlePanelProps) {
  const holders =
    [
      state.king,
      state.legend,
      state.elite,
    ].filter(
      Boolean,
    );

  return (
    <section className="overflow-hidden rounded-[2rem] border border-yellow-300/20 bg-[#0B0B10]">
      <header className="border-b border-white/10 px-6 py-5">
        <div className="flex items-center gap-2 text-yellow-200">
          <Crown size={21} />

          <p className="text-xs font-black uppercase tracking-[0.24em]">
            VYRO National Honors
          </p>
        </div>

        <h2 className="mt-2 text-2xl font-black text-white">
          Títulos nacionales activos
        </h2>
      </header>

      <div className="grid gap-4 p-5 xl:grid-cols-3">
        {holders.map(
          (holder) =>
            holder ? (
              <VyroTitleBadge
                key={`${holder.countryCode}:${holder.title}`}
                holder={holder}
              />
            ) : null,
        )}
      </div>

      {state.changes.length > 0 ? (
        <div className="border-t border-white/10 p-5">
          <div className="grid gap-4 lg:grid-cols-2">
            {state.changes.map(
              (change) => (
                <VyroTitleChange
                  key={change.id}
                  change={change}
                />
              ),
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}

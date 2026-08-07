"use client";

import {
  History,
} from "lucide-react";

import type {
  WorldTitleDefenseEvent,
} from "./types";

interface WorldTitleHistoryProps {
  defenses: WorldTitleDefenseEvent[];
}

export default function WorldTitleHistory({
  defenses,
}: WorldTitleHistoryProps) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center gap-2 text-white/50">
        <History size={18} />

        <p className="text-xs font-black uppercase tracking-[0.18em]">
          World Crown History
        </p>
      </div>

      <div className="mt-4 space-y-3">
        {defenses.length > 0 ? (
          defenses.map(
            (defense) => (
              <div
                key={defense.id}
                className="rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <p className="font-black text-white">
                  #{defense.defenseNumber} — {defense.holderName} vs {defense.challengerName}
                </p>

                <p className="mt-1 text-xs font-bold text-white/35">
                  {defense.successful
                    ? "Corona defendida"
                    : "Nuevo WORLD VYRO KING"}
                </p>
              </div>
            ),
          )
        ) : (
          <p className="text-sm font-bold text-white/35">
            Aún no hay defensas registradas.
          </p>
        )}
      </div>
    </section>
  );
}

"use client";

import {
  RotateCcw,
} from "lucide-react";

import BattleReplayCard from "./BattleReplayCard";

import type {
  BattleReplayMoment,
} from "./types";

interface BattleReplayProps {
  moments: BattleReplayMoment[];
  activeMomentId: string | null;
  onPlay: (
    moment: BattleReplayMoment,
  ) => void;
  onStop: () => void;
}

export default function BattleReplay({
  moments,
  activeMomentId,
  onPlay,
  onStop,
}: BattleReplayProps) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-cyan-300/15 bg-[#081018]">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-6 py-5">
        <div>
          <div className="flex items-center gap-2 text-cyan-200">
            <RotateCcw size={20} />

            <p className="text-xs font-black uppercase tracking-[0.24em]">
              Instant Replay
            </p>
          </div>

          <h2 className="mt-2 text-2xl font-black text-white">
            Revive los momentos clave
          </h2>
        </div>

        {activeMomentId ? (
          <button
            type="button"
            onClick={onStop}
            className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-black text-white/60 transition hover:bg-white/[0.1]"
          >
            Detener replay
          </button>
        ) : null}
      </header>

      <div className="grid gap-4 p-5 lg:grid-cols-2">
        {moments.length > 0 ? (
          moments.map(
            (moment) => (
              <BattleReplayCard
                key={moment.id}
                moment={moment}
                active={
                  activeMomentId ===
                  moment.id
                }
                onPlay={onPlay}
              />
            ),
          )
        ) : (
          <div className="lg:col-span-2 rounded-2xl border border-dashed border-white/10 p-8 text-center">
            <p className="font-bold text-white/40">
              Los momentos disponibles para replay aparecerán durante la Battle Series.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

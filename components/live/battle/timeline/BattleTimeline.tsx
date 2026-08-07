"use client";

import {
  Activity,
} from "lucide-react";

import BattleTimelineItem from "./BattleTimelineItem";

import type {
  BattleTimelineEvent,
} from "./types";

interface BattleTimelineProps {
  events: BattleTimelineEvent[];
}

export default function BattleTimeline({
  events,
}: BattleTimelineProps) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#07111D]">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-6 py-5">
        <div>
          <div className="flex items-center gap-2 text-cyan-300">
            <Activity size={20} />

            <p className="text-xs font-black uppercase tracking-[0.24em]">
              Battle Timeline
            </p>
          </div>

          <h2 className="mt-2 text-2xl font-black">
            Momentos de la batalla
          </h2>
        </div>

        <span className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-black text-white/50">
          {events.length} eventos
        </span>
      </header>

      <div className="max-h-[28rem] space-y-3 overflow-y-auto p-5">
        {events.length > 0 ? (
          events.map((event) => (
            <BattleTimelineItem
              key={event.id}
              event={event}
            />
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">
            <p className="font-bold text-white/45">
              Esperando eventos de la Battle Series...
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

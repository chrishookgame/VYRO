"use client";

import {
  BrainCircuit,
  Radio,
  Sparkles,
} from "lucide-react";

import BattleDirectorInsight from "./BattleDirectorInsight";

import type {
  BattleDirectorState,
} from "./types";

interface BattleAIDirectorProps {
  director: BattleDirectorState;
}

export default function BattleAIDirector({
  director,
}: BattleAIDirectorProps) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-fuchsia-400/20 bg-[linear-gradient(145deg,#100818,#080B13)]">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-6 py-5">
        <div>
          <div className="flex items-center gap-2 text-fuchsia-200">
            <BrainCircuit size={21} />

            <p className="text-xs font-black uppercase tracking-[0.24em]">
              VYRO AI Battle Director
            </p>
          </div>

          <h2 className="mt-2 text-2xl font-black text-white">
            {director.headline}
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/50">
            {director.summary}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-fuchsia-300/15 bg-fuchsia-300/[0.06] px-4 py-2">
          <Radio
            size={15}
            className={
              director.mode === "idle"
                ? "text-white/30"
                : "animate-pulse text-fuchsia-200"
            }
          />

          <span className="text-xs font-black uppercase tracking-[0.16em] text-fuchsia-100/70">
            {director.mode}
          </span>
        </div>
      </header>

      <div className="p-5">
        <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-white/50">
              <Sparkles size={17} />

              <span className="text-xs font-black uppercase tracking-[0.18em]">
                Battle Intensity
              </span>
            </div>

            <strong className="text-2xl font-black text-fuchsia-200">
              {director.intensity}%
            </strong>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-fuchsia-300 transition-all duration-700"
              style={{
                width:
                  `${director.intensity}%`,
              }}
            />
          </div>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {director.insights.length > 0 ? (
            director.insights.map(
              (insight) => (
                <BattleDirectorInsight
                  key={insight.id}
                  insight={insight}
                />
              ),
            )
          ) : (
            <div className="lg:col-span-2 rounded-2xl border border-dashed border-white/10 p-8 text-center">
              <p className="font-bold text-white/40">
                El AI Battle Director está observando la serie.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

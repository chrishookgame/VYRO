"use client";

import {
  BrainCircuit,
  Crown,
  Sparkles,
} from "lucide-react";

import BattleRecapCard from "./BattleRecapCard";
import BattleRecapTimeline from "./BattleRecapTimeline";

import type {
  BattleRecapData,
} from "./types";

interface BattleRecapProps {
  recap: BattleRecapData;
}

export default function BattleRecap({
  recap,
}: BattleRecapProps) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-cyan-300/15 bg-[linear-gradient(145deg,#07121A,#0C0B14)]">
      <header className="border-b border-white/10 px-6 py-6">
        <div className="flex items-center gap-2 text-cyan-200">
          <BrainCircuit size={21} />

          <p className="text-xs font-black uppercase tracking-[0.24em]">
            VYRO AI Battle Recap
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Crown
            size={30}
            className="text-yellow-300"
          />

          <h2 className="text-3xl font-black text-white">
            {recap.winnerName
              ? `${recap.winnerName} conquista la serie`
              : "Resumen de la Battle Series"}
          </h2>
        </div>

        <p className="mt-4 max-w-4xl text-sm leading-7 text-white/55">
          {recap.summary}
        </p>
      </header>

      <div className="grid gap-4 p-5 md:grid-cols-3">
        <BattleRecapCard
          label="Resultado final"
          value={recap.finalScore}
        />

        <BattleRecapCard
          label="Campeón"
          value={
            recap.winnerName ??
            "Sin campeón único"
          }
        />

        <BattleRecapCard
          label="MVP"
          value={
            recap.mvp ??
            "Por determinar"
          }
        />
      </div>

      <div className="grid gap-6 border-t border-white/10 p-5 lg:grid-cols-2">
        <div>
          <div className="flex items-center gap-2 text-yellow-200">
            <Sparkles size={18} />

            <h3 className="font-black">
              Highlights
            </h3>
          </div>

          <div className="mt-4 space-y-3">
            {recap.highlights.map(
              (highlight) => (
                <article
                  key={highlight.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                >
                  <p className="font-black text-white">
                    {highlight.title}
                  </p>

                  <p className="mt-1 text-sm leading-6 text-white/50">
                    {highlight.description}
                  </p>
                </article>
              ),
            )}
          </div>
        </div>

        <div>
          <h3 className="font-black text-cyan-200">
            Recap Timeline
          </h3>

          <div className="mt-4">
            <BattleRecapTimeline
              items={recap.timeline}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

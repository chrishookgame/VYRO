"use client";

import {
  BrainCircuit,
  Swords,
  Zap,
} from "lucide-react";

import NextChallengerCard from "./NextChallengerCard";
import PredictionMeter from "./PredictionMeter";

import type {
  NextChallengerData,
} from "./types";

interface NextChallengerProps {
  data: NextChallengerData;
}

export default function NextChallenger({
  data,
}: NextChallengerProps) {
  if (
    !data.champion ||
    !data.challenger
  ) {
    return null;
  }

  return (
    <section className="overflow-hidden rounded-[2.25rem] border border-fuchsia-300/20 bg-[linear-gradient(145deg,#12091B,#071018)]">
      <header className="border-b border-white/10 px-6 py-6">
        <div className="flex items-center gap-2 text-fuchsia-200">
          <BrainCircuit size={20} />

          <p className="text-xs font-black uppercase tracking-[0.24em]">
            VYRO Next Challenger AI
          </p>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <Swords
            size={28}
            className="text-white"
          />

          <h2 className="text-3xl font-black text-white">
            {data.headline}
          </h2>
        </div>

        <p className="mt-3 text-sm leading-7 text-white/50">
          {data.subtitle}
        </p>
      </header>

      <div className="grid gap-4 p-5 lg:grid-cols-2">
        <NextChallengerCard
          creator={
            data.champion
          }
          role="champion"
        />

        <NextChallengerCard
          creator={
            data.challenger
          }
          role="challenger"
        />
      </div>

      <div className="px-5 pb-5">
        <PredictionMeter
          championProbability={
            data.champion.victoryProbability
          }
          challengerProbability={
            data.challenger.victoryProbability
          }
        />
      </div>

      <footer className="border-t border-white/10 px-6 py-5">
        <div className="flex items-start gap-3">
          <Zap
            size={19}
            className="mt-1 shrink-0 text-yellow-200"
          />

          <div>
            <p className="font-black text-white">
              {data.hypeMessage}
            </p>

            <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-white/30">
              AI Confidence {data.confidence}%
            </p>
          </div>
        </div>
      </footer>
    </section>
  );
}

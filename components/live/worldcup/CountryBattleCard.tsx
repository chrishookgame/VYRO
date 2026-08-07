"use client";

import {
  Swords,
  Zap,
} from "lucide-react";

import type {
  VyroWorldCupMatchup,
} from "./types";

interface CountryBattleCardProps {
  matchup: VyroWorldCupMatchup;
}

export default function CountryBattleCard({
  matchup,
}: CountryBattleCardProps) {
  return (
    <article className="rounded-[2rem] border border-fuchsia-300/20 bg-[linear-gradient(145deg,#15091C,#080A10)] p-5">
      <div className="flex items-center gap-2 text-fuchsia-200">
        <Swords size={20} />

        <p className="text-xs font-black uppercase tracking-[0.18em]">
          Featured Country Battle
        </p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-white/30">
            {matchup.left.countryCode}
          </p>

          <h3 className="mt-2 text-2xl font-black text-white">
            {matchup.left.countryName}
          </h3>

          <p className="mt-2 text-3xl font-black text-yellow-200">
            {matchup.leftProbability}%
          </p>
        </div>

        <div className="text-center text-2xl font-black text-white/30">
          VS
        </div>

        <div className="md:text-right">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-white/30">
            {matchup.right.countryCode}
          </p>

          <h3 className="mt-2 text-2xl font-black text-white">
            {matchup.right.countryName}
          </h3>

          <p className="mt-2 text-3xl font-black text-fuchsia-200">
            {matchup.rightProbability}%
          </p>
        </div>
      </div>

      <div className="mt-5 flex h-3 overflow-hidden rounded-full bg-white/10">
        <div
          className="bg-yellow-300"
          style={{
            width:
              `${matchup.leftProbability}%`,
          }}
        />

        <div
          className="bg-fuchsia-400"
          style={{
            width:
              `${matchup.rightProbability}%`,
          }}
        />
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
        <Zap
          size={18}
          className="mt-0.5 shrink-0 text-yellow-200"
        />

        <p className="text-sm font-bold leading-6 text-white/60">
          {matchup.hypeMessage}
        </p>
      </div>
    </article>
  );
}

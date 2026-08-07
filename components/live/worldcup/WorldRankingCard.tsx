"use client";

import {
  Crown,
  Flame,
  Trophy,
} from "lucide-react";

import type {
  VyroWorldCupCountry,
} from "./types";

interface WorldRankingCardProps {
  country: VyroWorldCupCountry;
  leader?: boolean;
}

export default function WorldRankingCard({
  country,
  leader = false,
}: WorldRankingCardProps) {
  return (
    <article
      className={[
        "rounded-[2rem] border p-5",
        leader
          ? "border-yellow-300/30 bg-yellow-300/[0.07]"
          : "border-white/10 bg-white/[0.04]",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            {leader ? (
              <Crown
                size={19}
                className="text-yellow-200"
              />
            ) : (
              <Trophy
                size={19}
                className="text-cyan-200"
              />
            )}

            <p className="text-xs font-black uppercase tracking-[0.18em] text-white/40">
              World Rank #{country.rank}
            </p>
          </div>

          <h3 className="mt-3 text-2xl font-black text-white">
            {country.countryName}
          </h3>

          <p className="mt-1 text-sm font-bold text-white/40">
            {country.kingName
              ? `King: ${country.kingName}`
              : "No active King"}
          </p>
        </div>

        <div className="text-right">
          <p className="text-3xl font-black text-cyan-200">
            {country.score}
          </p>

          <p className="mt-1 text-xs font-black uppercase tracking-[0.14em] text-white/30">
            Points
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
          <p className="text-xs text-white/35">
            Wins
          </p>

          <p className="mt-1 font-black text-white">
            {country.totalWins}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
          <p className="text-xs text-white/35">
            Battles
          </p>

          <p className="mt-1 font-black text-white">
            {country.totalBattles}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
          <Flame
            size={15}
            className="text-orange-200"
          />

          <p className="mt-2 text-xs text-white/35">
            Momentum
          </p>

          <p className="mt-1 font-black text-white">
            {country.momentum}
          </p>
        </div>
      </div>

      {country.topCreators.length > 0 ? (
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-white/30">
            Top Creators
          </p>

          <p className="mt-2 text-sm font-bold text-white/60">
            {country.topCreators.join(" · ")}
          </p>
        </div>
      ) : null}
    </article>
  );
}

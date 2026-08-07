"use client";

import {
  Globe2,
  Trophy,
} from "lucide-react";

import CountryBattleCard from "./CountryBattleCard";
import WorldRankingCard from "./WorldRankingCard";

import type {
  VyroWorldCupData,
} from "./types";

interface VyroWorldCupProps {
  data: VyroWorldCupData;
}

export default function VyroWorldCup({
  data,
}: VyroWorldCupProps) {
  return (
    <section className="overflow-hidden rounded-[2.25rem] border border-cyan-300/20 bg-[linear-gradient(145deg,#06141C,#080A10)]">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-6 py-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-200">
            <Globe2 size={21} />

            <p className="text-xs font-black uppercase tracking-[0.24em]">
              VYRO Live World Cup
            </p>
          </div>

          <h2 className="mt-2 text-3xl font-black text-white">
            {data.seasonName}
          </h2>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-yellow-300/15 bg-yellow-300/[0.05] px-4 py-2 text-xs font-black text-yellow-200/70">
          <Trophy size={15} />

          Season {data.seasonNumber}
        </div>
      </header>

      {data.featuredMatchup ? (
        <div className="p-5">
          <CountryBattleCard
            matchup={
              data.featuredMatchup
            }
          />
        </div>
      ) : null}

      <div className="grid gap-4 border-t border-white/10 p-5 lg:grid-cols-2">
        {data.countries.map(
          (country) => (
            <WorldRankingCard
              key={country.countryCode}
              country={country}
              leader={
                data.leader?.countryCode ===
                country.countryCode
              }
            />
          ),
        )}
      </div>
    </section>
  );
}

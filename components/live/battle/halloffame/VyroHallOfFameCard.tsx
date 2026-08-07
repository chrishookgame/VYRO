"use client";

import {
  Crown,
  Medal,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";

import type {
  VyroHallOfFameEntry,
} from "./types";

interface VyroHallOfFameCardProps {
  entry: VyroHallOfFameEntry;
  leader?: boolean;
}

export default function VyroHallOfFameCard({
  entry,
  leader = false,
}: VyroHallOfFameCardProps) {
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
                size={20}
                className="text-yellow-200"
              />
            ) : (
              <Medal
                size={20}
                className="text-cyan-200"
              />
            )}

            <p className="text-xs font-black uppercase tracking-[0.18em] text-white/40">
              {entry.inducted
                ? "Hall of Fame"
                : "Legacy Candidate"}
            </p>
          </div>

          <h3 className="mt-3 text-2xl font-black text-white">
            {entry.creatorName}
          </h3>

          <p className="mt-1 text-sm font-bold text-white/40">
            {entry.countryName}
          </p>
        </div>

        <div className="text-right">
          <p className="text-3xl font-black text-yellow-200">
            {entry.legacyScore}
          </p>

          <p className="mt-1 text-xs font-black uppercase tracking-[0.14em] text-white/30">
            Legacy
          </p>
        </div>
      </div>

      {entry.highestTitle ? (
        <div className="mt-4 rounded-2xl border border-yellow-300/15 bg-yellow-300/[0.05] px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-yellow-200">
          Highest Honor: {entry.highestTitle}
        </div>
      ) : null}

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
          <Trophy
            size={15}
            className="text-yellow-200"
          />

          <p className="mt-2 text-xs text-white/35">
            Wins
          </p>

          <p className="mt-1 font-black text-white">
            {entry.totalWins}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
          <Sparkles
            size={15}
            className="text-fuchsia-200"
          />

          <p className="mt-2 text-xs text-white/35">
            Best Streak
          </p>

          <p className="mt-1 font-black text-white">
            {entry.bestStreak}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
          <ShieldCheck
            size={15}
            className="text-cyan-200"
          />

          <p className="mt-2 text-xs text-white/35">
            Defenses
          </p>

          <p className="mt-1 font-black text-white">
            {entry.titleDefenses}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
          <p className="text-xs text-white/35">
            Championships
          </p>

          <p className="mt-1 font-black text-white">
            {entry.championships}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
          <p className="text-xs text-white/35">
            Days Champion
          </p>

          <p className="mt-1 font-black text-white">
            {entry.daysAsChampion}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
          <p className="text-xs text-white/35">
            Battles
          </p>

          <p className="mt-1 font-black text-white">
            {entry.totalBattles}
          </p>
        </div>
      </div>
    </article>
  );
}

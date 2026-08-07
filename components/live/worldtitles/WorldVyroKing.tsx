"use client";

import {
  Crown,
  Globe2,
  ShieldCheck,
  Trophy,
} from "lucide-react";

import type {
  WorldVyroKingState,
} from "./types";

interface WorldVyroKingProps {
  state: WorldVyroKingState;
}

export default function WorldVyroKing({
  state,
}: WorldVyroKingProps) {
  if (!state.holder) {
    return null;
  }

  const dangerLabel =
    state.dangerLevel === "critical"
      ? "CRITICAL"
      : state.dangerLevel === "danger"
        ? "DANGER"
        : state.dangerLevel === "watch"
          ? "WATCH"
          : "SAFE";

  return (
    <section className="overflow-hidden rounded-[2.25rem] border border-yellow-300/25 bg-[linear-gradient(145deg,#1B1206,#07090E)]">
      <header className="border-b border-white/10 px-6 py-6">
        <div className="flex items-center gap-2 text-yellow-200">
          <Globe2 size={20} />
          <Crown size={22} />

          <p className="text-xs font-black uppercase tracking-[0.24em]">
            WORLD VYRO KING
          </p>
        </div>

        <h2 className="mt-4 text-4xl font-black text-white">
          {state.holder.creatorName}
        </h2>

        <p className="mt-2 text-sm font-bold text-white/45">
          {state.holder.countryName}
        </p>
      </header>

      <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <Trophy
            size={17}
            className="text-yellow-200"
          />

          <p className="mt-2 text-xs text-white/35">
            World Rank
          </p>

          <p className="mt-1 text-xl font-black text-white">
            #{state.holder.worldRank}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-xs text-white/35">
            Score
          </p>

          <p className="mt-1 text-xl font-black text-white">
            {state.holder.score}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <ShieldCheck
            size={17}
            className="text-cyan-200"
          />

          <p className="mt-2 text-xs text-white/35">
            Defenses
          </p>

          <p className="mt-1 text-xl font-black text-white">
            {state.totalDefenses}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-xs text-white/35">
            Threat Level
          </p>

          <p className="mt-1 text-xl font-black text-fuchsia-200">
            {dangerLabel}
          </p>
        </div>
      </div>

      {state.challengerName ? (
        <footer className="border-t border-white/10 px-6 py-5 text-sm font-black text-white/55">
          Próximo retador mundial:{" "}
          <span className="text-fuchsia-200">
            {state.challengerName}
          </span>
        </footer>
      ) : null}
    </section>
  );
}

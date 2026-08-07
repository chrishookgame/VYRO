"use client";

import {
  Activity,
  Flame,
  Sparkles,
  Trophy,
} from "lucide-react";

import type {
  BattleMVPScore as BattleMVPScoreData,
} from "./types";

interface BattleMVPScoreProps {
  score: BattleMVPScoreData;
  winner?: boolean;
}

export default function BattleMVPScore({
  score,
  winner = false,
}: BattleMVPScoreProps) {
  return (
    <article
      className={[
        "rounded-3xl border p-5",
        winner
          ? "border-yellow-300/30 bg-yellow-300/[0.08]"
          : "border-white/10 bg-white/[0.04]",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-lg font-black text-white">
            {score.creatorName}
          </p>

          <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-white/35">
            MVP Score
          </p>
        </div>

        <strong className="text-3xl font-black text-yellow-200">
          {score.score}
        </strong>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
          <Trophy
            size={16}
            className="text-yellow-200"
          />

          <p className="mt-2 text-xs font-bold text-white/40">
            Wins
          </p>

          <p className="mt-1 font-black text-white">
            {score.winsScore}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
          <Sparkles
            size={16}
            className="text-fuchsia-200"
          />

          <p className="mt-2 text-xs font-bold text-white/40">
            Highlights
          </p>

          <p className="mt-1 font-black text-white">
            {score.highlightScore}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
          <Flame
            size={16}
            className="text-orange-200"
          />

          <p className="mt-2 text-xs font-bold text-white/40">
            Momentum
          </p>

          <p className="mt-1 font-black text-white">
            {score.momentumScore}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
          <Activity
            size={16}
            className="text-cyan-200"
          />

          <p className="mt-2 text-xs font-bold text-white/40">
            Dominance
          </p>

          <p className="mt-1 font-black text-white">
            {score.dominanceScore}
          </p>
        </div>
      </div>
    </article>
  );
}

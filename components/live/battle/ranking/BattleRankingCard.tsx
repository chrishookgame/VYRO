"use client";

import {
  ArrowDown,
  ArrowUp,
  Minus,
  Trophy,
} from "lucide-react";

import type {
  BattleRankingCreator,
} from "./types";

interface BattleRankingCardProps {
  creator: BattleRankingCreator;
  leader?: boolean;
}

export default function BattleRankingCard({
  creator,
  leader = false,
}: BattleRankingCardProps) {
  const MovementIcon =
    creator.status === "rising"
      ? ArrowUp
      : creator.status === "falling"
        ? ArrowDown
        : Minus;

  return (
    <article
      className={[
        "rounded-3xl border p-5",
        leader
          ? "border-yellow-300/30 bg-yellow-300/[0.07]"
          : "border-white/10 bg-white/[0.04]",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            {leader ? (
              <Trophy
                size={18}
                className="text-yellow-200"
              />
            ) : null}

            <p className="font-black text-white">
              {creator.creatorName}
            </p>
          </div>

          <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-white/35">
            Ranking #{creator.rank}
          </p>
        </div>

        <div className="text-right">
          <p className="text-3xl font-black text-cyan-200">
            {creator.score}
          </p>

          <div className="mt-1 flex items-center justify-end gap-1 text-xs font-black text-white/40">
            <MovementIcon size={14} />

            {creator.movement === 0
              ? "0"
              : creator.movement > 0
                ? `+${creator.movement}`
                : creator.movement}
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
          <p className="text-xs text-white/35">
            Wins
          </p>

          <p className="mt-1 font-black text-white">
            {creator.wins}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
          <p className="text-xs text-white/35">
            Losses
          </p>

          <p className="mt-1 font-black text-white">
            {creator.losses}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
          <p className="text-xs text-white/35">
            Draws
          </p>

          <p className="mt-1 font-black text-white">
            {creator.draws}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
          <p className="text-xs text-white/35">
            Streak
          </p>

          <p className="mt-1 font-black text-white">
            {creator.streak}
          </p>
        </div>
      </div>
    </article>
  );
}

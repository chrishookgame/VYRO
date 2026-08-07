"use client";

import {
  Crown,
  Medal,
  ShieldCheck,
} from "lucide-react";

import type {
  VyroTitleHolder,
} from "./types";

interface VyroTitleBadgeProps {
  holder: VyroTitleHolder;
}

export default function VyroTitleBadge({
  holder,
}: VyroTitleBadgeProps) {
  const Icon =
    holder.title === "VYRO_KING"
      ? Crown
      : holder.title === "VYRO_LEGEND"
        ? Medal
        : ShieldCheck;

  const label =
    holder.title === "VYRO_KING"
      ? "VYRO KING"
      : holder.title === "VYRO_LEGEND"
        ? "VYRO LEGEND"
        : "VYRO ELITE";

  return (
    <article className="rounded-3xl border border-yellow-300/20 bg-[linear-gradient(145deg,#1B1207,#090A10)] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-yellow-200">
            <Icon size={20} />

            <p className="text-xs font-black uppercase tracking-[0.18em]">
              {label}
            </p>
          </div>

          <h3 className="mt-3 text-2xl font-black text-white">
            {holder.creatorName}
          </h3>

          <p className="mt-1 text-sm font-bold text-white/40">
            {holder.countryName}
          </p>
        </div>

        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-black text-white/40">
          #{holder.rank}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
          <p className="text-xs text-white/35">
            Score
          </p>

          <p className="mt-1 font-black text-white">
            {holder.score}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
          <p className="text-xs text-white/35">
            Followers
          </p>

          <p className="mt-1 font-black text-white">
            {holder.followers}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
          <p className="text-xs text-white/35">
            Wins
          </p>

          <p className="mt-1 font-black text-white">
            {holder.battleWins}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
          <p className="text-xs text-white/35">
            Battles
          </p>

          <p className="mt-1 font-black text-white">
            {holder.battleCount}
          </p>
        </div>
      </div>
    </article>
  );
}

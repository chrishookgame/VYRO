"use client";

import {
  Crown,
  Equal,
  Flame,
  Trophy,
} from "lucide-react";

import type {
  BattleHighlight,
} from "./types";

interface BattleHighlightCardProps {
  highlight: BattleHighlight;
}

export default function BattleHighlightCard({
  highlight,
}: BattleHighlightCardProps) {
  const Icon =
    highlight.type === "champion"
      ? Crown
      : highlight.type === "draw"
        ? Equal
        : highlight.type === "victory"
          ? Trophy
          : Flame;

  return (
    <article className="rounded-3xl border border-yellow-300/15 bg-[linear-gradient(145deg,rgba(35,26,8,0.85),rgba(18,11,26,0.9))] p-5 shadow-[0_20px_70px_rgba(250,204,21,0.06)]">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-yellow-300/20 bg-yellow-300/10">
          <Icon
            size={22}
            className="text-yellow-200"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-black text-white">
              {highlight.title}
            </p>

            <span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/40">
              P{highlight.priority}
            </span>
          </div>

          <p className="mt-2 text-sm leading-6 text-white/55">
            {highlight.description}
          </p>

          <time className="mt-3 block text-xs font-bold text-white/30">
            {new Intl.DateTimeFormat(
              "es-419",
              {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              },
            ).format(
              new Date(
                highlight.createdAt,
              ),
            )}
          </time>
        </div>
      </div>
    </article>
  );
}

"use client";

import {
  Activity,
  BrainCircuit,
  Crown,
  Flame,
  Gauge,
  Sparkles,
  Trophy,
} from "lucide-react";

import type {
  BattleDirectorInsight,
} from "./types";

interface BattleDirectorInsightProps {
  insight: BattleDirectorInsight;
}

export default function BattleDirectorInsight({
  insight,
}: BattleDirectorInsightProps) {
  const Icon =
    insight.type === "champion"
      ? Crown
      : insight.type === "dominance"
        ? Trophy
        : insight.type === "comeback"
          ? Flame
          : insight.type === "momentum"
            ? Activity
            : insight.type === "close_battle"
              ? Gauge
              : insight.type === "draw_pressure"
                ? Sparkles
                : BrainCircuit;

  return (
    <article className="rounded-2xl border border-fuchsia-300/15 bg-white/[0.04] p-4">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-fuchsia-300/20 bg-fuchsia-300/10">
          <Icon
            size={18}
            className="text-fuchsia-200"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-black text-white">
              {insight.title}
            </p>

            <span className="rounded-full border border-white/10 bg-black/25 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-white/40">
              {insight.priority}
            </span>
          </div>

          <p className="mt-2 text-sm leading-6 text-white/55">
            {insight.message}
          </p>
        </div>
      </div>
    </article>
  );
}

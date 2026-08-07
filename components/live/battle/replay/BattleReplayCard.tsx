"use client";

import {
  Crown,
  Equal,
  Play,
  Trophy,
} from "lucide-react";

import type {
  BattleReplayMoment,
} from "./types";

interface BattleReplayCardProps {
  moment: BattleReplayMoment;
  active: boolean;
  onPlay: (
    moment: BattleReplayMoment,
  ) => void;
}

export default function BattleReplayCard({
  moment,
  active,
  onPlay,
}: BattleReplayCardProps) {
  const Icon =
    moment.type === "champion"
      ? Crown
      : moment.type === "draw"
        ? Equal
        : moment.type === "victory"
          ? Trophy
          : Play;

  return (
    <button
      type="button"
      onClick={() => {
        onPlay(moment);
      }}
      className={[
        "w-full rounded-3xl border p-5 text-left transition",
        active
          ? "border-cyan-300/40 bg-cyan-300/10 shadow-[0_0_60px_rgba(34,211,238,0.12)]"
          : "border-white/10 bg-white/[0.04] hover:bg-white/[0.07]",
      ].join(" ")}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10">
          <Icon
            size={22}
            className="text-cyan-200"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-black text-white">
              {moment.title}
            </p>

            <span className="text-xs font-black text-white/35">
              {Math.max(
                1,
                Math.round(
                  moment.durationMs /
                    1000,
                ),
              )}s
            </span>
          </div>

          <p className="mt-2 text-sm leading-6 text-white/55">
            {moment.description}
          </p>

          <div className="mt-4 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-cyan-200">
            <Play size={14} />
            Reproducir momento
          </div>
        </div>
      </div>
    </button>
  );
}

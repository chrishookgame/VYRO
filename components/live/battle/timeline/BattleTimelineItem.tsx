"use client";

import {
  CircleDot,
  Crown,
  Equal,
  Trophy,
} from "lucide-react";

import type {
  BattleTimelineEvent,
} from "./types";

interface BattleTimelineItemProps {
  event: BattleTimelineEvent;
}

export default function BattleTimelineItem({
  event,
}: BattleTimelineItemProps) {
  const Icon =
    event.type === "series_finished"
      ? Crown
      : event.type === "round_draw"
        ? Equal
        : event.type === "score_changed"
          ? Trophy
          : CircleDot;

  return (
    <article className="relative flex gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-fuchsia-400/20 bg-fuchsia-400/10">
        <Icon
          size={18}
          className="text-fuchsia-200"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-black text-white">
            {event.title}
          </p>

          <time className="text-xs font-bold text-white/35">
            {new Intl.DateTimeFormat(
              "es-419",
              {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              },
            ).format(
              new Date(
                event.createdAt,
              ),
            )}
          </time>
        </div>

        <p className="mt-1 text-sm leading-6 text-white/55">
          {event.description}
        </p>
      </div>
    </article>
  );
}

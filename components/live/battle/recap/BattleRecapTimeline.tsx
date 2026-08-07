"use client";

import type {
  BattleRecapTimelineItem,
} from "./types";

interface BattleRecapTimelineProps {
  items: BattleRecapTimelineItem[];
}

export default function BattleRecapTimeline({
  items,
}: BattleRecapTimelineProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-start gap-4 rounded-2xl border border-white/10 bg-black/20 p-4"
        >
          <div className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-cyan-300" />

          <div className="min-w-0">
            <p className="font-black text-white">
              {item.title}
            </p>

            <time className="mt-1 block text-xs font-bold text-white/35">
              {new Intl.DateTimeFormat(
                "es-419",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                },
              ).format(
                new Date(
                  item.timestamp,
                ),
              )}
            </time>
          </div>
        </div>
      ))}
    </div>
  );
}

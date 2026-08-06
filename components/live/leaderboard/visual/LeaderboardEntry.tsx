"use client";

import type {
  LiveLeaderboardEntry as LiveLeaderboardEntryData,
} from "../types";

interface LeaderboardEntryProps {
  entry: LiveLeaderboardEntryData;
}

function getRankBadge(
  rank: number,
): string {
  if (rank === 1) {
    return "🥇";
  }

  if (rank === 2) {
    return "🥈";
  }

  if (rank === 3) {
    return "🥉";
  }

  return `#${rank}`;
}

export default function LeaderboardEntry({
  entry,
}: LeaderboardEntryProps) {
  return (
    <article className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/10 text-sm font-black text-cyan-100">
        {getRankBadge(entry.rank)}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-black text-white">
          {entry.displayName}
        </p>

        <p className="mt-1 text-xs text-white/45">
          {entry.giftCount.toLocaleString(
            "es-419",
          )}{" "}
          regalos
        </p>
      </div>

      <div className="text-right">
        <p className="text-sm font-black text-cyan-100">
          {entry.totalAmount.toLocaleString(
            "es-419",
          )}{" "}
          VYRO
        </p>

        <p className="mt-1 text-xs font-bold text-yellow-200/70">
          ⚡{" "}
          {entry.totalEnergy.toLocaleString(
            "es-419",
          )}
        </p>
      </div>
    </article>
  );
}

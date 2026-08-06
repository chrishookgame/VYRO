"use client";

import type {
  LiveLeaderboardEntry,
} from "../types";

interface LeaderboardPodiumProps {
  entries: LiveLeaderboardEntry[];
}

const podiumStyles = [
  {
    badge: "🥇",
    className:
      "border-yellow-300/35 bg-yellow-300/10 text-yellow-100",
  },
  {
    badge: "🥈",
    className:
      "border-slate-200/30 bg-slate-200/10 text-slate-100",
  },
  {
    badge: "🥉",
    className:
      "border-orange-300/30 bg-orange-300/10 text-orange-100",
  },
];

export default function LeaderboardPodium({
  entries,
}: LeaderboardPodiumProps) {
  const topThree =
    entries.slice(0, 3);

  if (topThree.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {topThree.map(
        (
          entry,
          index,
        ) => {
          const style =
            podiumStyles[index];

          return (
            <article
              key={entry.userId}
              className={`rounded-3xl border p-4 text-center ${style.className}`}
            >
              <div className="text-3xl">
                {style.badge}
              </div>

              <p className="mt-3 truncate text-sm font-black">
                {entry.displayName}
              </p>

              <p className="mt-2 text-lg font-black">
                {entry.totalAmount.toLocaleString(
                  "es-419",
                )}{" "}
                VYRO
              </p>

              <p className="mt-1 text-xs opacity-70">
                {entry.giftCount.toLocaleString(
                  "es-419",
                )}{" "}
                regalos
              </p>
            </article>
          );
        },
      )}
    </div>
  );
}

"use client";

import type {
  LiveLeaderboardEntry,
} from "../types";

import LeaderboardEntry from "./LeaderboardEntry";
import LeaderboardPodium from "./LeaderboardPodium";

interface LiveLeaderboardPanelProps {
  entries: LiveLeaderboardEntry[];
  totalParticipants?: number;
  title?: string;
}

export default function LiveLeaderboardPanel({
  entries,
  totalParticipants = entries.length,
  title = "Top donadores LIVE",
}: LiveLeaderboardPanelProps) {
  const remainingEntries =
    entries.slice(3);

  return (
    <section className="rounded-[2rem] border border-cyan-400/15 bg-[#07111D] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">
            VYRO LEADERBOARD
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">
            {title}
          </h2>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-right">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
            Participantes
          </p>

          <p className="mt-1 text-xl font-black text-white">
            {totalParticipants.toLocaleString(
              "es-419",
            )}
          </p>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-white/10 bg-black/15 p-10 text-center">
          <div className="text-4xl">
            🏆
          </div>

          <p className="mt-4 text-sm font-black text-white">
            Todavía no hay donadores
          </p>

          <p className="mt-2 text-sm text-white/45">
            El ranking se actualizará cuando lleguen regalos.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6">
            <LeaderboardPodium
              entries={entries}
            />
          </div>

          {remainingEntries.length > 0 ? (
            <div className="mt-5 space-y-3">
              {remainingEntries.map(
                (entry) => (
                  <LeaderboardEntry
                    key={entry.userId}
                    entry={entry}
                  />
                ),
              )}
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}

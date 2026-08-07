"use client";

import {
  Crown,
  Flame,
  Shield,
  Swords,
} from "lucide-react";

import type {
  NextChallengerPrediction,
} from "./types";

interface NextChallengerCardProps {
  creator: NextChallengerPrediction;
  role: "champion" | "challenger";
}

export default function NextChallengerCard({
  creator,
  role,
}: NextChallengerCardProps) {
  const isChampion =
    role === "champion";

  return (
    <article
      className={[
        "rounded-[2rem] border p-5",
        isChampion
          ? "border-yellow-300/25 bg-yellow-300/[0.07]"
          : "border-fuchsia-300/20 bg-fuchsia-300/[0.05]",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div
            className={[
              "flex items-center gap-2",
              isChampion
                ? "text-yellow-200"
                : "text-fuchsia-200",
            ].join(" ")}
          >
            {isChampion ? (
              <Crown size={20} />
            ) : (
              <Swords size={20} />
            )}

            <p className="text-xs font-black uppercase tracking-[0.18em]">
              {isChampion
                ? "Champion"
                : "Next Challenger"}
            </p>
          </div>

          <h3 className="mt-3 text-2xl font-black text-white">
            {creator.creatorName}
          </h3>

          <p className="mt-1 text-sm font-bold text-white/40">
            {creator.level}
          </p>
        </div>

        <div className="text-right">
          <p
            className={[
              "text-3xl font-black",
              isChampion
                ? "text-yellow-200"
                : "text-fuchsia-200",
            ].join(" ")}
          >
            {creator.victoryProbability}%
          </p>

          <p className="mt-1 text-xs font-black uppercase tracking-[0.14em] text-white/30">
            Victory
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
          <Shield
            size={15}
            className="text-cyan-200"
          />

          <p className="mt-2 text-xs text-white/35">
            Score
          </p>

          <p className="mt-1 font-black text-white">
            {creator.score}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
          <p className="text-xs text-white/35">
            Wins
          </p>

          <p className="mt-1 font-black text-white">
            {creator.battleWins}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
          <p className="text-xs text-white/35">
            Win Rate
          </p>

          <p className="mt-1 font-black text-white">
            {creator.winRate}%
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
          <Flame
            size={15}
            className="text-orange-200"
          />

          <p className="mt-2 text-xs text-white/35">
            Streak
          </p>

          <p className="mt-1 font-black text-white">
            {creator.streak}
          </p>
        </div>
      </div>

      {creator.title ? (
        <div className="mt-4 rounded-2xl border border-yellow-300/15 bg-yellow-300/[0.05] px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-yellow-200">
          {creator.title}
        </div>
      ) : null}
    </article>
  );
}

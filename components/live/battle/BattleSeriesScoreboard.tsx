"use client";

import {
  Crown,
  Equal,
  Swords,
  Trophy,
} from "lucide-react";

import type {
  BattleSeriesStatus,
} from "./BattleScheduler";

interface BattleSeriesScoreboardProps {
  status: BattleSeriesStatus;
  currentPosition: number;
  totalBattles: number;
  leftCreatorId: string;
  rightCreatorId: string;
  leftCreatorName: string;
  rightCreatorName: string;
  leftWins: number;
  rightWins: number;
  draws: number;
  winnerId: string | null;
}

function getSeriesLeaderLabel({
  status,
  leftCreatorId,
  rightCreatorId,
  leftCreatorName,
  rightCreatorName,
  leftWins,
  rightWins,
  winnerId,
}: Pick<
  BattleSeriesScoreboardProps,
  | "status"
  | "leftCreatorId"
  | "rightCreatorId"
  | "leftCreatorName"
  | "rightCreatorName"
  | "leftWins"
  | "rightWins"
  | "winnerId"
>): string {
  if (status === "finished") {
    if (!winnerId) {
      return "Serie empatada";
    }

    if (winnerId === leftCreatorId) {
      return `${leftCreatorName} es campeón`;
    }

    if (winnerId === rightCreatorId) {
      return `${rightCreatorName} es campeón`;
    }

    return "Campeón pendiente";
  }

  if (leftWins > rightWins) {
    return `${leftCreatorName} lidera`;
  }

  if (rightWins > leftWins) {
    return `${rightCreatorName} lidera`;
  }

  return "Serie empatada";
}

export default function BattleSeriesScoreboard({
  status,
  currentPosition,
  totalBattles,
  leftCreatorId,
  rightCreatorId,
  leftCreatorName,
  rightCreatorName,
  leftWins,
  rightWins,
  draws,
  winnerId,
}: BattleSeriesScoreboardProps) {
  const safeTotalBattles =
    Math.max(1, totalBattles);

  const safeCurrentPosition =
    Math.min(
      Math.max(0, currentPosition),
      safeTotalBattles,
    );

  const progressPercent =
    Math.round(
      (safeCurrentPosition /
        safeTotalBattles) *
        100,
    );

  const leaderLabel =
    getSeriesLeaderLabel({
      status,
      leftCreatorId,
      rightCreatorId,
      leftCreatorName,
      rightCreatorName,
      leftWins,
      rightWins,
      winnerId,
    });

  return (
    <section className="overflow-hidden rounded-[2rem] border border-amber-400/20 bg-[#07111D] p-6 text-white shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 text-amber-300">
            <Trophy size={22} />

            <p className="text-xs font-black uppercase tracking-[0.24em]">
              VYRO Series Scoreboard
            </p>
          </div>

          <h2 className="mt-3 text-2xl font-black">
            Marcador general
          </h2>

          <p className="mt-2 text-sm text-white/45">
            Resultado acumulado de toda la serie.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-right">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
            Ronda
          </p>

          <p className="mt-1 text-lg font-black">
            {safeCurrentPosition}/
            {safeTotalBattles}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
        <article className="rounded-3xl border border-cyan-400/20 bg-cyan-400/[0.06] p-6 text-center">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
            Lado izquierdo
          </p>

          <h3 className="mt-3 truncate text-xl font-black">
            {leftCreatorName}
          </h3>

          <p className="mt-4 text-5xl font-black text-cyan-200">
            {leftWins}
          </p>

          <p className="mt-2 text-sm text-white/45">
            Victorias
          </p>
        </article>

        <div className="flex flex-col items-center justify-center gap-2 px-4">
          <Swords
            size={30}
            className="text-amber-300"
          />

          <p className="text-xs font-black uppercase tracking-[0.18em] text-white/35">
            VS
          </p>
        </div>

        <article className="rounded-3xl border border-fuchsia-400/20 bg-fuchsia-400/[0.06] p-6 text-center">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-fuchsia-300">
            Lado derecho
          </p>

          <h3 className="mt-3 truncate text-xl font-black">
            {rightCreatorName}
          </h3>

          <p className="mt-4 text-5xl font-black text-fuchsia-200">
            {rightWins}
          </p>

          <p className="mt-2 text-sm text-white/45">
            Victorias
          </p>
        </article>
      </div>

      <div className="mt-5 flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
        <Equal
          size={18}
          className="text-white/45"
        />

        <p className="text-sm font-bold text-white/60">
          Empates: {draws}
        </p>
      </div>

      <div className="mt-5 overflow-hidden rounded-full border border-white/10 bg-white/[0.05]">
        <div
          className="h-3 bg-amber-400 transition-[width] duration-500"
          style={{
            width: `${progressPercent}%`,
          }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-xs font-black text-white/35">
        <span>
          Progreso de la serie
        </span>

        <span>
          {progressPercent}%
        </span>
      </div>

      <div className="mt-6 rounded-3xl border border-amber-400/20 bg-amber-400/[0.06] p-5 text-center">
        {status === "finished" ? (
          <Crown
            size={30}
            className="mx-auto text-amber-300"
          />
        ) : (
          <Trophy
            size={30}
            className="mx-auto text-amber-300"
          />
        )}

        <p className="mt-3 text-sm font-black text-amber-100">
          {leaderLabel}
        </p>
      </div>
    </section>
  );
}

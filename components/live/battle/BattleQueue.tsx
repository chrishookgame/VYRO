"use client";

import {
  CheckCircle2,
  Clock3,
  Swords,
  Trophy,
  XCircle,
} from "lucide-react";

import type {
  BattleSeriesRound,
} from "./BattleScheduler";

interface BattleQueueProps {
  rounds: BattleSeriesRound[];
  currentPosition: number;
  leftCreatorId: string;
  rightCreatorId: string;
  leftCreatorName: string;
  rightCreatorName: string;
}

function getRoundStatusLabel(
  round: BattleSeriesRound,
): string {
  if (round.status === "active") {
    return "En curso";
  }

  if (round.status === "finished") {
    return "Finalizada";
  }

  if (round.status === "cancelled") {
    return "Cancelada";
  }

  return "Pendiente";
}

function getWinnerLabel(
  round: BattleSeriesRound,
  leftCreatorId: string,
  rightCreatorId: string,
  leftCreatorName: string,
  rightCreatorName: string,
): string {
  if (
    round.status !== "finished"
  ) {
    return "";
  }

  if (!round.winnerId) {
    return "Empate";
  }

  if (
    round.winnerId ===
    leftCreatorId
  ) {
    return leftCreatorName;
  }

  if (
    round.winnerId ===
    rightCreatorId
  ) {
    return rightCreatorName;
  }

  return "Ganador pendiente";
}

function renderStatusIcon(
  round: BattleSeriesRound,
) {
  if (round.status === "active") {
    return (
      <Swords
        size={18}
        className="text-fuchsia-300"
      />
    );
  }

  if (round.status === "finished") {
    return (
      <CheckCircle2
        size={18}
        className="text-emerald-300"
      />
    );
  }

  if (round.status === "cancelled") {
    return (
      <XCircle
        size={18}
        className="text-red-300"
      />
    );
  }

  return (
    <Clock3
      size={18}
      className="text-white/35"
    />
  );
}

export default function BattleQueue({
  rounds,
  currentPosition,
  leftCreatorId,
  rightCreatorId,
  leftCreatorName,
  rightCreatorName,
}: BattleQueueProps) {
  const completedRounds =
    rounds.filter(
      (round) =>
        round.status ===
        "finished",
    ).length;

  return (
    <section className="rounded-[2rem] border border-white/10 bg-[#07111D] p-6 text-white shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 text-cyan-300">
            <Trophy size={22} />

            <p className="text-xs font-black uppercase tracking-[0.24em]">
              VYRO Battle Queue
            </p>
          </div>

          <h2 className="mt-3 text-2xl font-black">
            Rondas de la serie
          </h2>

          <p className="mt-2 text-sm text-white/45">
            Seguimiento completo de batallas pendientes,
            activas y finalizadas.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-right">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
            Progreso
          </p>

          <p className="mt-1 text-lg font-black">
            {completedRounds}/
            {rounds.length}
          </p>
        </div>
      </div>

      {rounds.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-white/10 p-8 text-center text-sm text-white/45">
          Todavía no hay rondas programadas.
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {rounds.map((round) => {
            const winnerLabel =
              getWinnerLabel(
                round,
                leftCreatorId,
                rightCreatorId,
                leftCreatorName,
                rightCreatorName,
              );

            const isCurrent =
              round.position ===
              currentPosition;

            return (
              <article
                key={round.position}
                className={`rounded-2xl border p-4 transition ${
                  isCurrent
                    ? "border-fuchsia-400/30 bg-fuchsia-400/[0.08]"
                    : "border-white/10 bg-white/[0.03]"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/20 font-black text-white">
                      {round.position}
                    </span>

                    <div>
                      <p className="font-black">
                        Batalla {round.position}
                      </p>

                      <div className="mt-1 flex items-center gap-2 text-xs text-white/45">
                        {renderStatusIcon(round)}

                        <span>
                          {getRoundStatusLabel(
                            round,
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    {winnerLabel ? (
                      <>
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/35">
                          Ganador
                        </p>

                        <p className="mt-1 font-black text-emerald-300">
                          {winnerLabel}
                        </p>
                      </>
                    ) : (
                      <p className="text-xs text-white/35">
                        {round.battleId
                          ? `ID ${round.battleId.slice(0, 8)}`
                          : "Sin batalla asignada"}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

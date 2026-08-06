"use client";

import {
  useEffect,
  useRef,
} from "react";
import {
  Clock3,
  Swords,
  Trophy,
} from "lucide-react";

import {
  useBattleCountdown,
} from "@/hooks";

interface BattleIntermissionProps {
  currentPosition: number;
  totalBattles: number;
  nextBattleAt: string;
  autoStartNext?: boolean;
  onReady?: () => void;
}

export default function BattleIntermission({
  currentPosition,
  totalBattles,
  nextBattleAt,
  autoStartNext = true,
  onReady,
}: BattleIntermissionProps) {
  const readyCalledRef =
    useRef(false);

  const countdown =
    useBattleCountdown({
      phase: "intermission",
      targetAt: nextBattleAt,
      enabled: true,
      tickIntervalMs: 250,
    });

  useEffect(() => {
    readyCalledRef.current = false;
  }, [nextBattleAt]);

  useEffect(() => {
    if (
      !countdown.ready ||
      !autoStartNext ||
      readyCalledRef.current
    ) {
      return;
    }

    readyCalledRef.current = true;
    onReady?.();
  }, [
    autoStartNext,
    countdown.ready,
    onReady,
  ]);

  const nextPosition =
    Math.min(
      currentPosition + 1,
      totalBattles,
    );

  return (
    <section className="overflow-hidden rounded-[2rem] border border-violet-400/20 bg-[#07111D] p-6 text-white shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 text-violet-300">
            <Trophy size={22} />

            <p className="text-xs font-black uppercase tracking-[0.24em]">
              VYRO Battle Series
            </p>
          </div>

          <h2 className="mt-3 text-2xl font-black">
            Ronda {currentPosition} finalizada
          </h2>

          <p className="mt-2 text-sm text-white/45">
            Próxima batalla: {nextPosition} de{" "}
            {totalBattles}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-right">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
            Progreso
          </p>

          <p className="mt-1 text-lg font-black">
            {currentPosition}/{totalBattles}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-violet-400/20 bg-violet-400/[0.06] p-8 text-center">
        <Clock3
          size={34}
          className="mx-auto text-violet-300"
        />

        <p className="mt-4 text-xs font-black uppercase tracking-[0.22em] text-white/45">
          Próxima batalla en
        </p>

        <p
          aria-live="polite"
          className="mt-3 text-6xl font-black tabular-nums"
        >
          {countdown.label}
        </p>

        <div className="mt-5 flex items-center justify-center gap-2 text-sm font-bold text-violet-200">
          <Swords size={18} />

          <span>
            {countdown.expired
              ? autoStartNext
                ? "Iniciando siguiente batalla..."
                : "La siguiente batalla está lista."
              : "Prepárense para la próxima ronda."}
          </span>
        </div>
      </div>
    </section>
  );
}

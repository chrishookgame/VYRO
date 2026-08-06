"use client";

import {
  useEffect,
  useRef,
} from "react";
import {
  Flame,
  Swords,
  Trophy,
} from "lucide-react";

import {
  useBattleCountdown,
} from "@/hooks";

interface BattleRoundTransitionProps {
  round: number;
  totalRounds: number;
  leftCreatorName: string;
  rightCreatorName: string;
  startsAt: string;
  onFinished?: () => void;
}

export default function BattleRoundTransition({
  round,
  totalRounds,
  leftCreatorName,
  rightCreatorName,
  startsAt,
  onFinished,
}: BattleRoundTransitionProps) {
  const finishedCalledRef =
    useRef(false);

  const countdown =
    useBattleCountdown({
      phase: "scheduled",
      targetAt: startsAt,
      enabled: true,
      tickIntervalMs: 100,
    });

  useEffect(() => {
    finishedCalledRef.current = false;
  }, [startsAt]);

  useEffect(() => {
    if (
      !countdown.ready ||
      finishedCalledRef.current
    ) {
      return;
    }

    finishedCalledRef.current = true;
    onFinished?.();
  }, [
    countdown.ready,
    onFinished,
  ]);

  const fightLabel =
    countdown.remainingSeconds <= 0
      ? "FIGHT!"
      : countdown.remainingSeconds <= 3
        ? countdown.remainingSeconds.toString()
        : countdown.label;

  return (
    <section
      aria-live="polite"
      className="relative overflow-hidden rounded-[2rem] border border-fuchsia-400/30 bg-[radial-gradient(circle_at_top,#34114d_0%,#0a0f1c_48%,#05070d_100%)] p-6 text-white shadow-[0_30px_100px_rgba(217,70,239,0.18)] md:p-10"
    >
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute left-[-10%] top-[-30%] h-72 w-72 rounded-full bg-cyan-400 blur-[120px]" />
        <div className="absolute bottom-[-35%] right-[-10%] h-80 w-80 rounded-full bg-fuchsia-500 blur-[130px]" />
      </div>

      <div className="relative">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-fuchsia-200">
            <Trophy size={22} />

            <p className="text-xs font-black uppercase tracking-[0.26em]">
              VYRO Battle Series
            </p>
          </div>

          <div className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white/60">
            Ronda {round} de {totalRounds}
          </div>
        </div>

        <div className="mt-10 grid items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
          <article className="rounded-3xl border border-cyan-400/20 bg-cyan-400/[0.07] p-6 text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
              Creador izquierdo
            </p>

            <h2 className="mt-4 break-words text-2xl font-black md:text-3xl">
              {leftCreatorName}
            </h2>
          </article>

          <div className="flex flex-col items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-fuchsia-300/30 bg-fuchsia-400/10 shadow-[0_0_50px_rgba(232,121,249,0.25)]">
              <Swords
                size={34}
                className="text-fuchsia-200"
              />
            </div>

            <div className="mt-5 flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-orange-200">
              <Flame size={18} />
              Próxima batalla
            </div>
          </div>

          <article className="rounded-3xl border border-fuchsia-400/20 bg-fuchsia-400/[0.07] p-6 text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-fuchsia-300">
              Creador derecho
            </p>

            <h2 className="mt-4 break-words text-2xl font-black md:text-3xl">
              {rightCreatorName}
            </h2>
          </article>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-black/30 p-8 text-center">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-white/45">
            Comienza en
          </p>

          <p
            className="mt-4 text-7xl font-black tabular-nums tracking-tight md:text-8xl"
          >
            {fightLabel}
          </p>

          <p className="mt-5 text-sm font-bold text-white/50">
            Prepárense. La ronda comenzará automáticamente.
          </p>
        </div>
      </div>
    </section>
  );
}

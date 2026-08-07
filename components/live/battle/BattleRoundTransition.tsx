"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Flame,
  Sparkles,
  Swords,
  Trophy,
  Zap,
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

type TransitionStage =
  | "intro"
  | "versus"
  | "countdown"
  | "fight";

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

  const [mounted, setMounted] =
    useState(false);

  const countdown =
    useBattleCountdown({
      phase: "scheduled",
      targetAt: startsAt,
      enabled: true,
      tickIntervalMs: 100,
    });

  useEffect(() => {
    setMounted(true);

    return () => {
      setMounted(false);
    };
  }, []);

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

  const stage = useMemo<
    TransitionStage
  >(() => {
    if (
      countdown.remainingSeconds <= 0
    ) {
      return "fight";
    }

    if (
      countdown.remainingSeconds <= 3
    ) {
      return "countdown";
    }

    if (
      countdown.remainingSeconds <= 6
    ) {
      return "versus";
    }

    return "intro";
  }, [
    countdown.remainingSeconds,
  ]);

  const fightLabel =
    stage === "fight"
      ? "FIGHT!"
      : stage === "countdown"
        ? countdown.remainingSeconds.toString()
        : countdown.label;

  const stageMessage =
    stage === "intro"
      ? "Presentando competidores"
      : stage === "versus"
        ? "Enfrentamiento confirmado"
        : stage === "countdown"
          ? "La batalla comienza"
          : "¡Que comience la batalla!";

  return (
    <section
      aria-live="polite"
      className="relative overflow-hidden rounded-[2rem] border border-fuchsia-400/30 bg-[radial-gradient(circle_at_top,#34114d_0%,#0a0f1c_48%,#05070d_100%)] p-6 text-white shadow-[0_30px_100px_rgba(217,70,239,0.18)] md:p-10"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.04)_48%,transparent_52%)] bg-[length:220%_100%] animate-[pulse_2.4s_ease-in-out_infinite]" />

        <div
          className={[
            "absolute left-[-10%] top-[-30%] h-72 w-72 rounded-full bg-cyan-400 blur-[120px] transition-all duration-1000",
            mounted
              ? "scale-100 opacity-35"
              : "scale-50 opacity-0",
          ].join(" ")}
        />

        <div
          className={[
            "absolute bottom-[-35%] right-[-10%] h-80 w-80 rounded-full bg-fuchsia-500 blur-[130px] transition-all duration-1000",
            mounted
              ? "scale-100 opacity-35"
              : "scale-50 opacity-0",
          ].join(" ")}
        />

        <div className="absolute left-1/2 top-1/2 h-px w-[80%] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      <div className="relative">
        <div
          className={[
            "flex flex-wrap items-center justify-between gap-4 transition-all duration-700",
            mounted
              ? "translate-y-0 opacity-100"
              : "-translate-y-4 opacity-0",
          ].join(" ")}
        >
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

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-300/20 bg-orange-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-orange-200">
            <Sparkles size={16} />
            {stageMessage}
          </div>
        </div>

        <div className="mt-10 grid items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
          <article
            className={[
              "rounded-3xl border border-cyan-400/20 bg-cyan-400/[0.07] p-6 text-center transition-all duration-700",
              mounted
                ? "translate-x-0 opacity-100"
                : "-translate-x-10 opacity-0",
            ].join(" ")}
          >
            <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
              Creador izquierdo
            </p>

            <h2 className="mt-4 break-words text-2xl font-black md:text-3xl">
              {leftCreatorName}
            </h2>
          </article>

          <div
            className={[
              "flex flex-col items-center justify-center transition-all duration-700 delay-150",
              mounted
                ? "scale-100 opacity-100"
                : "scale-75 opacity-0",
            ].join(" ")}
          >
            <div
              className={[
                "relative flex h-24 w-24 items-center justify-center rounded-full border border-fuchsia-300/30 bg-fuchsia-400/10 shadow-[0_0_50px_rgba(232,121,249,0.25)] transition-all duration-500",
                stage === "versus" ||
                stage === "countdown" ||
                stage === "fight"
                  ? "scale-110 shadow-[0_0_80px_rgba(232,121,249,0.45)]"
                  : "scale-100",
              ].join(" ")}
            >
              <Swords
                size={38}
                className={[
                  "text-fuchsia-200 transition-transform duration-500",
                  stage === "fight"
                    ? "rotate-12 scale-125"
                    : "",
                ].join(" ")}
              />

              {stage === "fight" ? (
                <Zap
                  size={20}
                  className="absolute -right-2 -top-2 animate-pulse text-yellow-300"
                />
              ) : null}
            </div>

            <div className="mt-5 flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-orange-200">
              <Flame
                size={18}
                className={
                  stage === "countdown" ||
                  stage === "fight"
                    ? "animate-pulse"
                    : ""
                }
              />

              VS
            </div>
          </div>

          <article
            className={[
              "rounded-3xl border border-fuchsia-400/20 bg-fuchsia-400/[0.07] p-6 text-center transition-all duration-700",
              mounted
                ? "translate-x-0 opacity-100"
                : "translate-x-10 opacity-0",
            ].join(" ")}
          >
            <p className="text-xs font-black uppercase tracking-[0.2em] text-fuchsia-300">
              Creador derecho
            </p>

            <h2 className="mt-4 break-words text-2xl font-black md:text-3xl">
              {rightCreatorName}
            </h2>
          </article>
        </div>

        <div
          className={[
            "mt-10 rounded-3xl border border-white/10 bg-black/30 p-8 text-center transition-all duration-500",
            stage === "fight"
              ? "border-yellow-300/40 bg-yellow-300/10 shadow-[0_0_70px_rgba(253,224,71,0.18)]"
              : "",
          ].join(" ")}
        >
          <p className="text-xs font-black uppercase tracking-[0.24em] text-white/45">
            {stage === "fight"
              ? "Batalla activa"
              : "Comienza en"}
          </p>

          <p
            key={fightLabel}
            className={[
              "mt-4 font-black tabular-nums tracking-tight",
              stage === "fight"
                ? "animate-pulse text-6xl text-yellow-300 md:text-7xl"
                : stage === "countdown"
                  ? "animate-pulse text-8xl text-white md:text-9xl"
                  : "text-7xl md:text-8xl",
            ].join(" ")}
          >
            {fightLabel}
          </p>

          <p className="mt-5 text-sm font-bold text-white/50">
            {stage === "fight"
              ? "La ronda ha comenzado."
              : "Prepárense. La ronda comenzará automáticamente."}
          </p>
        </div>
      </div>
    </section>
  );
}

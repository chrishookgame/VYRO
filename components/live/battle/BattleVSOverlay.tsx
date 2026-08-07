"use client";

import {
  useEffect,
  useState,
} from "react";
import {
  Flame,
  Sparkles,
  Swords,
  Trophy,
  Zap,
} from "lucide-react";


interface BattleVSOverlayProps {
  visible: boolean;
  round: number;
  totalRounds: number;
  leftCreatorName: string;
  rightCreatorName: string;
  remainingSeconds: number;
  countdownLabel: string;
}

export default function BattleVSOverlay({
  visible,
  round,
  totalRounds,
  leftCreatorName,
  rightCreatorName,
  remainingSeconds,
  countdownLabel,
}: BattleVSOverlayProps) {
  const [mounted, setMounted] =
    useState(false);


  useEffect(() => {
    if (!visible) {
      setMounted(false);
      return;
    }

    const frame =
      window.requestAnimationFrame(
        () => {
          setMounted(true);
        },
      );

    return () => {
      window.cancelAnimationFrame(
        frame,
      );
    };
  }, [visible]);



  if (!visible) {
    return null;
  }

  const showFight =
    remainingSeconds <= 0;

  const showFinalCountdown =
    remainingSeconds > 0 &&
    remainingSeconds <= 3;

  const displayValue =
    showFight
      ? "FIGHT!"
      : showFinalCountdown
        ? remainingSeconds
            .toString()
        : countdownLabel;

  return (
    <div
      aria-live="assertive"
      role="dialog"
      aria-modal="true"
      aria-label="Presentación de batalla"
      className={[
        "fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black/90 px-4 py-8 text-white backdrop-blur-xl transition-all duration-500",
        mounted
          ? "opacity-100"
          : "opacity-0",
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,70,239,0.22),transparent_48%)]" />

        <div className="absolute left-[-10%] top-[-20%] h-[28rem] w-[28rem] rounded-full bg-cyan-400/20 blur-[150px]" />

        <div className="absolute bottom-[-25%] right-[-10%] h-[32rem] w-[32rem] rounded-full bg-fuchsia-500/20 blur-[170px]" />

        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/20 to-transparent" />

        <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <section
        className={[
          "relative w-full max-w-6xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-[linear-gradient(135deg,rgba(8,15,29,0.98),rgba(30,9,43,0.98))] p-6 shadow-[0_40px_140px_rgba(0,0,0,0.65)] transition-all duration-700 md:p-10",
          mounted
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0",
        ].join(" ")}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-fuchsia-200">
            <Trophy size={22} />

            <p className="text-xs font-black uppercase tracking-[0.28em]">
              VYRO Battle Series
            </p>
          </div>

          <div className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white/60">
            Ronda {round} de{" "}
            {totalRounds}
          </div>
        </div>

        <div className="mt-10 grid items-center gap-8 md:grid-cols-[1fr_auto_1fr]">
          <article
            className={[
              "rounded-[2rem] border border-cyan-400/20 bg-cyan-400/[0.08] p-7 text-center transition-all duration-700",
              mounted
                ? "translate-x-0 opacity-100"
                : "-translate-x-16 opacity-0",
            ].join(" ")}
          >
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-300/10 shadow-[0_0_60px_rgba(34,211,238,0.18)]">
              <Sparkles
                size={36}
                className="text-cyan-200"
              />
            </div>

            <p className="mt-5 text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
              Lado izquierdo
            </p>

            <h2 className="mt-3 break-words text-3xl font-black md:text-4xl">
              {leftCreatorName}
            </h2>
          </article>

          <div
            className={[
              "flex flex-col items-center justify-center transition-all delay-150 duration-700",
              mounted
                ? "scale-100 opacity-100"
                : "scale-50 opacity-0",
            ].join(" ")}
          >
            <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-fuchsia-300/40 bg-fuchsia-400/10 shadow-[0_0_100px_rgba(232,121,249,0.32)]">
              <Swords
                size={52}
                className={[
                  "text-fuchsia-100 transition-all duration-500",
                  showFight
                    ? "rotate-12 scale-125"
                    : "",
                ].join(" ")}
              />

              <Zap
                size={24}
                className="absolute -right-2 -top-2 animate-pulse text-yellow-300"
              />

              <Flame
                size={24}
                className="absolute -bottom-2 -left-2 animate-pulse text-orange-300"
              />
            </div>

            <p className="mt-5 text-2xl font-black uppercase tracking-[0.24em] text-fuchsia-200">
              VS
            </p>
          </div>

          <article
            className={[
              "rounded-[2rem] border border-fuchsia-400/20 bg-fuchsia-400/[0.08] p-7 text-center transition-all duration-700",
              mounted
                ? "translate-x-0 opacity-100"
                : "translate-x-16 opacity-0",
            ].join(" ")}
          >
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-fuchsia-300/30 bg-fuchsia-300/10 shadow-[0_0_60px_rgba(232,121,249,0.18)]">
              <Sparkles
                size={36}
                className="text-fuchsia-200"
              />
            </div>

            <p className="mt-5 text-xs font-black uppercase tracking-[0.22em] text-fuchsia-300">
              Lado derecho
            </p>

            <h2 className="mt-3 break-words text-3xl font-black md:text-4xl">
              {rightCreatorName}
            </h2>
          </article>
        </div>

        <div
          className={[
            "mt-10 rounded-[2rem] border p-8 text-center transition-all duration-500",
            showFight
              ? "border-yellow-300/40 bg-yellow-300/10 shadow-[0_0_100px_rgba(253,224,71,0.2)]"
              : "border-white/10 bg-black/30",
          ].join(" ")}
        >
          <p className="text-xs font-black uppercase tracking-[0.24em] text-white/45">
            {showFight
              ? "Batalla activa"
              : "Comienza en"}
          </p>

          <p
            key={displayValue}
            className={[
              "mt-4 font-black tabular-nums tracking-tight",
              showFight
                ? "animate-pulse text-6xl text-yellow-300 md:text-8xl"
                : showFinalCountdown
                  ? "animate-pulse text-8xl md:text-9xl"
                  : "text-7xl md:text-8xl",
            ].join(" ")}
          >
            {displayValue}
          </p>

          <p className="mt-5 text-sm font-bold text-white/50">
            {showFight
              ? "La ronda ha comenzado."
              : "Prepárense para el enfrentamiento."}
          </p>
        </div>
      </section>
    </div>
  );
}

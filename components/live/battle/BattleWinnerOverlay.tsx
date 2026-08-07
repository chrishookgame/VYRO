"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Crown,
  Sparkles,
  Trophy,
} from "lucide-react";

interface BattleWinnerOverlayProps {
  visible: boolean;
  winnerName: string | null;
  isSeriesWinner?: boolean;
  durationMs?: number;
  onFinished?: () => void;
}

export default function BattleWinnerOverlay({
  visible,
  winnerName,
  isSeriesWinner = false,
  durationMs = 4000,
  onFinished,
}: BattleWinnerOverlayProps) {
  const [mounted, setMounted] =
    useState(false);

  const finishedCalledRef =
    useRef(false);

  useEffect(() => {
    if (!visible) {
      setMounted(false);
      finishedCalledRef.current =
        false;
      return;
    }

    const frame =
      window.requestAnimationFrame(
        () => {
          setMounted(true);
        },
      );

    const safeDuration =
      Math.max(
        1000,
        Math.floor(
          durationMs,
        ),
      );

    const timeoutId =
      window.setTimeout(() => {
        if (
          finishedCalledRef.current
        ) {
          return;
        }

        finishedCalledRef.current =
          true;
        setMounted(false);

        window.setTimeout(() => {
          onFinished?.();
        }, 450);
      }, safeDuration);

    return () => {
      window.cancelAnimationFrame(
        frame,
      );

      window.clearTimeout(
        timeoutId,
      );
    };
  }, [
    durationMs,
    onFinished,
    visible,
  ]);

  if (!visible) {
    return null;
  }

  const title =
    isSeriesWinner
      ? "Battle Series Champion"
      : "Round Winner";

  const displayName =
    winnerName?.trim() ||
    "Empate";

  return (
    <div
      aria-live="assertive"
      role="dialog"
      aria-modal="true"
      aria-label="Resultado de la batalla"
      className={[
        "fixed inset-0 z-[110] flex items-center justify-center overflow-hidden bg-black/90 px-4 py-8 text-white backdrop-blur-xl transition-all duration-500",
        mounted
          ? "opacity-100"
          : "opacity-0",
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.22),transparent_50%)]" />

        <div className="absolute left-[-12%] top-[-20%] h-[30rem] w-[30rem] rounded-full bg-yellow-300/20 blur-[160px]" />

        <div className="absolute bottom-[-25%] right-[-12%] h-[34rem] w-[34rem] rounded-full bg-fuchsia-500/20 blur-[180px]" />

        {Array.from({
          length: 24,
        }).map((_, index) => (
          <span
            key={index}
            className="absolute h-2 w-2 animate-pulse rounded-full bg-yellow-200/70"
            style={{
              left:
                `${(index * 37) % 100}%`,
              top:
                `${(index * 53) % 100}%`,
              animationDelay:
                `${(index % 8) * 120}ms`,
            }}
          />
        ))}
      </div>

      <section
        className={[
          "relative w-full max-w-4xl overflow-hidden rounded-[2.5rem] border border-yellow-300/30 bg-[linear-gradient(145deg,rgba(36,25,5,0.98),rgba(28,8,35,0.98))] p-8 text-center shadow-[0_40px_140px_rgba(0,0,0,0.7)] transition-all duration-700 md:p-12",
          mounted
            ? "scale-100 opacity-100"
            : "scale-90 opacity-0",
        ].join(" ")}
      >
        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-yellow-300/40 bg-yellow-300/10 shadow-[0_0_100px_rgba(250,204,21,0.32)]">
          {isSeriesWinner ? (
            <Crown
              size={52}
              className="animate-pulse text-yellow-300"
            />
          ) : (
            <Trophy
              size={52}
              className="animate-pulse text-yellow-300"
            />
          )}
        </div>

        <div className="mt-7 flex items-center justify-center gap-2 text-yellow-200">
          <Sparkles size={20} />

          <p className="text-xs font-black uppercase tracking-[0.28em]">
            VYRO Battle Series
          </p>

          <Sparkles size={20} />
        </div>

        <p className="mt-6 text-sm font-black uppercase tracking-[0.24em] text-white/45">
          {title}
        </p>

        <h2 className="mt-4 break-words text-5xl font-black text-yellow-300 md:text-7xl">
          {displayName}
        </h2>

        <p className="mt-6 text-base font-bold text-white/55">
          {winnerName
            ? isSeriesWinner
              ? "¡Campeón absoluto de la Battle Series!"
              : "¡Victoria en esta ronda!"
            : "La ronda terminó en empate."}
        </p>
      </section>
    </div>
  );
}

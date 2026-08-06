"use client";

import {
  useEffect,
  useMemo,
  useRef,
} from "react";

import {
  useBattleCountdown,
} from "@/hooks";

interface BattleCountdownProps {
  endsAt: Date | string;
  onFinished?: () => void;
}

export default function BattleCountdown({
  endsAt,
  onFinished,
}: BattleCountdownProps) {
  const finishedCalledRef =
    useRef(false);

  const targetAt = useMemo(
    () =>
      endsAt instanceof Date
        ? endsAt.toISOString()
        : endsAt,
    [endsAt],
  );

  const countdown =
    useBattleCountdown({
      phase: "active",
      targetAt,
      enabled: true,
      tickIntervalMs: 250,
    });

  useEffect(() => {
    finishedCalledRef.current = false;
  }, [targetAt]);

  useEffect(() => {
    if (
      !countdown.expired ||
      finishedCalledRef.current
    ) {
      return;
    }

    finishedCalledRef.current = true;
    onFinished?.();
  }, [
    countdown.expired,
    onFinished,
  ]);

  return (
    <div className="rounded-3xl border border-red-500/20 bg-[#111827] p-6 text-center">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-red-300">
        Battle Countdown
      </p>

      <div
        aria-live="polite"
        className="mt-3 text-5xl font-black tabular-nums text-white"
      >
        {countdown.label}
      </div>

      <p className="mt-3 text-sm text-gray-400">
        {countdown.expired
          ? "La batalla terminó."
          : "Tiempo restante"}
      </p>
    </div>
  );
}

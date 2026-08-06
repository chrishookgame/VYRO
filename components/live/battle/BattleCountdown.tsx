"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

interface BattleCountdownProps {
  endsAt: Date | string;
  onFinished?: () => void;
}

function formatTime(
  totalSeconds: number,
): string {
  const minutes = Math.floor(
    totalSeconds / 60,
  );

  const seconds =
    totalSeconds % 60;

  return `${minutes}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

export default function BattleCountdown({
  endsAt,
  onFinished,
}: BattleCountdownProps) {
  const endTime = useMemo(
    () => new Date(endsAt).getTime(),
    [endsAt],
  );

  const getRemaining = useCallback(
    () =>
      Math.max(
        0,
        Math.floor(
          (endTime - Date.now()) /
            1000,
        ),
      ),
    [endTime],
  );

  const [remaining, setRemaining] =
    useState(getRemaining);

  useEffect(() => {
    const timer = window.setInterval(
      () => {
        const value =
          getRemaining();

        setRemaining(value);

        if (value === 0) {
          window.clearInterval(
            timer,
          );

          onFinished?.();
        }
      },
      1000,
    );

    return () =>
      window.clearInterval(timer);
  }, [getRemaining, onFinished]);

  return (
    <div className="rounded-3xl border border-red-500/20 bg-[#111827] p-6 text-center">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-red-300">
        Battle Countdown
      </p>

      <div className="mt-3 text-5xl font-black text-white">
        {formatTime(remaining)}
      </div>

      <p className="mt-3 text-sm text-gray-400">
        {remaining === 0
          ? "La batalla terminó."
          : "Tiempo restante"}
      </p>
    </div>
  );
}

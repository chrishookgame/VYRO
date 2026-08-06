"use client";

import {
  useMemo,
  useState,
} from "react";
import {
  CalendarClock,
  Clock3,
  Play,
  Settings2,
  Swords,
  Trophy,
} from "lucide-react";

import type {
  BattleSeriesConfig,
} from "./BattleScheduler";

interface BattleStudioProps {
  disabled?: boolean;
  onCreateSeries?: (
    config: BattleSeriesConfig,
  ) => void;
}

const battleCountOptions = [
  1,
  3,
  5,
  7,
  10,
  15,
  20,
];

const durationOptions = [
  60,
  120,
  180,
  300,
  600,
];

const breakOptions = [
  0,
  30,
  60,
  120,
  300,
];

function formatDuration(
  totalSeconds: number,
): string {
  if (totalSeconds < 60) {
    return `${totalSeconds} segundos`;
  }

  const minutes =
    totalSeconds / 60;

  return `${minutes} ${
    minutes === 1
      ? "minuto"
      : "minutos"
  }`;
}

export default function BattleStudio({
  disabled = false,
  onCreateSeries,
}: BattleStudioProps) {
  const [totalBattles, setTotalBattles] =
    useState(3);

  const [
    battleDurationSeconds,
    setBattleDurationSeconds,
  ] = useState(180);

  const [
    breakDurationSeconds,
    setBreakDurationSeconds,
  ] = useState(60);

  const [
    autoStartNext,
    setAutoStartNext,
  ] = useState(true);

  const config =
    useMemo<BattleSeriesConfig>(
      () => ({
        totalBattles,
        battleDurationSeconds,
        breakDurationSeconds,
        autoStartNext,
      }),
      [
        autoStartNext,
        battleDurationSeconds,
        breakDurationSeconds,
        totalBattles,
      ],
    );

  const estimatedDuration =
    totalBattles *
      battleDurationSeconds +
    Math.max(
      0,
      totalBattles - 1,
    ) *
      breakDurationSeconds;

  return (
    <section className="overflow-hidden rounded-[2rem] border border-fuchsia-400/20 bg-[#07111D] text-white shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
      <div className="border-b border-white/10 p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 text-fuchsia-300">
              <Settings2 size={22} />

              <p className="text-xs font-black uppercase tracking-[0.24em]">
                VYRO Battle Studio
              </p>
            </div>

            <h2 className="mt-3 text-3xl font-black">
              Configura tu batalla
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">
              Crea una batalla individual o una serie automática
              con descansos y duración personalizada.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-right">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
              Duración estimada
            </p>

            <p className="mt-1 text-lg font-black text-fuchsia-200">
              {formatDuration(
                estimatedDuration,
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-6 md:p-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-black text-white">
              <Trophy
                size={18}
                className="text-amber-300"
              />
              Cantidad de batallas
            </label>

            <div className="mt-3 flex flex-wrap gap-2">
              {battleCountOptions.map(
                (value) => (
                  <button
                    key={value}
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                      setTotalBattles(
                        value,
                      );
                    }}
                    className={`rounded-full px-4 py-2 text-sm font-black transition ${
                      totalBattles === value
                        ? "bg-fuchsia-400 text-black"
                        : "border border-white/10 bg-white/[0.04] text-white/60 hover:border-fuchsia-400/40 hover:text-white"
                    } disabled:cursor-not-allowed disabled:opacity-50`}
                  >
                    {value}
                  </button>
                ),
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="battle-duration"
              className="flex items-center gap-2 text-sm font-black text-white"
            >
              <Clock3
                size={18}
                className="text-cyan-300"
              />
              Duración de cada batalla
            </label>

            <select
              id="battle-duration"
              value={
                battleDurationSeconds
              }
              disabled={disabled}
              onChange={(event) => {
                setBattleDurationSeconds(
                  Number(
                    event.target.value,
                  ),
                );
              }}
              className="mt-3 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 font-bold text-white outline-none transition focus:border-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {durationOptions.map(
                (value) => (
                  <option
                    key={value}
                    value={value}
                  >
                    {formatDuration(
                      value,
                    )}
                  </option>
                ),
              )}
            </select>
          </div>

          <div>
            <label
              htmlFor="battle-break"
              className="flex items-center gap-2 text-sm font-black text-white"
            >
              <CalendarClock
                size={18}
                className="text-violet-300"
              />
              Descanso entre batallas
            </label>

            <select
              id="battle-break"
              value={
                breakDurationSeconds
              }
              disabled={disabled}
              onChange={(event) => {
                setBreakDurationSeconds(
                  Number(
                    event.target.value,
                  ),
                );
              }}
              className="mt-3 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 font-bold text-white outline-none transition focus:border-violet-400/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {breakOptions.map(
                (value) => (
                  <option
                    key={value}
                    value={value}
                  >
                    {value === 0
                      ? "Sin descanso"
                      : formatDuration(
                          value,
                        )}
                  </option>
                ),
              )}
            </select>
          </div>

          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div>
              <p className="font-black">
                Inicio automático
              </p>

              <p className="mt-1 text-sm text-white/40">
                VYRO iniciará la siguiente batalla cuando termine
                el descanso.
              </p>
            </div>

            <input
              type="checkbox"
              checked={autoStartNext}
              disabled={disabled}
              onChange={(event) => {
                setAutoStartNext(
                  event.target.checked,
                );
              }}
              className="h-5 w-5 accent-fuchsia-400"
            />
          </label>
        </div>

        <aside className="rounded-3xl border border-white/10 bg-black/20 p-6">
          <div className="flex items-center gap-3 text-cyan-300">
            <Swords size={22} />

            <p className="text-xs font-black uppercase tracking-[0.22em]">
              Vista previa
            </p>
          </div>

          <h3 className="mt-4 text-2xl font-black">
            Serie de {totalBattles}{" "}
            {totalBattles === 1
              ? "batalla"
              : "batallas"}
          </h3>

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <span className="text-sm text-white/45">
                Duración
              </span>

              <strong>
                {formatDuration(
                  battleDurationSeconds,
                )}
              </strong>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <span className="text-sm text-white/45">
                Descanso
              </span>

              <strong>
                {breakDurationSeconds ===
                0
                  ? "Sin descanso"
                  : formatDuration(
                      breakDurationSeconds,
                    )}
              </strong>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <span className="text-sm text-white/45">
                Siguiente ronda
              </span>

              <strong>
                {autoStartNext
                  ? "Automática"
                  : "Manual"}
              </strong>
            </div>
          </div>

          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              onCreateSeries?.(
                config,
              );
            }}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-fuchsia-400 px-5 py-4 font-black text-black transition hover:bg-fuchsia-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Play size={20} />
            Crear Battle Series
          </button>
        </aside>
      </div>
    </section>
  );
}

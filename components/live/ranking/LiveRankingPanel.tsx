"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Crown,
  Flame,
  Gift,
  LoaderCircle,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

import {
  getLiveRanking,
  type LiveRankingPeriod,
  type LiveRankingRow,
  type LiveRankingType,
} from "@/lib/live-ranking";

const rankingTypes: Array<{
  id: LiveRankingType;
  label: string;
}> = [
  { id: "gifter", label: "Regalos" },
  { id: "energy", label: "Energía" },
  { id: "viewer", label: "Audiencia" },
  { id: "creator", label: "Creadores" },
];

const rankingPeriods: Array<{
  id: LiveRankingPeriod;
  label: string;
}> = [
  { id: "live", label: "LIVE" },
  { id: "daily", label: "Hoy" },
  { id: "weekly", label: "Semana" },
  { id: "monthly", label: "Mes" },
  { id: "all_time", label: "Global" },
];

function renderRankingIcon(type: LiveRankingType) {
  if (type === "gifter") {
    return <Gift size={42} className="mx-auto text-cyan-400" />;
  }

  if (type === "energy") {
    return <Zap size={42} className="mx-auto text-cyan-400" />;
  }

  if (type === "viewer") {
    return <Users size={42} className="mx-auto text-cyan-400" />;
  }

  return <Crown size={42} className="mx-auto text-cyan-400" />;
}

function getUserLabel(userId: string): string {
  return `VYRO ${userId.slice(0, 8).toUpperCase()}`;
}

function formatScore(score: number): string {
  return new Intl.NumberFormat("es-419", {
    maximumFractionDigits: 0,
  }).format(score);
}

export default function LiveRankingPanel() {
  const [rankingType, setRankingType] =
    useState<LiveRankingType>("gifter");

  const [rankingPeriod, setRankingPeriod] =
    useState<LiveRankingPeriod>("weekly");

  const [entries, setEntries] =
    useState<LiveRankingRow[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRanking = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const ranking = await getLiveRanking(
        rankingType,
        rankingPeriod,
      );

      setEntries(ranking);
    } catch (rankingError) {
      setError(
        rankingError instanceof Error
          ? rankingError.message
          : "No se pudo cargar el ranking LIVE.",
      );
    } finally {
      setLoading(false);
    }
  }, [rankingPeriod, rankingType]);

  useEffect(() => {
    void loadRanking();
  }, [loadRanking]);
  const topThree = entries.slice(0, 3);
  const remainingEntries = entries.slice(3);

  return (
    <section className="mt-10 overflow-hidden rounded-3xl border border-cyan-500/20 bg-[#0B1220]">
      <div className="border-b border-white/10 p-6 md:p-8">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <div className="flex items-center gap-3">
              <Trophy className="text-cyan-400" />

              <p className="font-bold uppercase tracking-[0.25em] text-cyan-400">
                VYRO LIVE RANKING
              </p>
            </div>

            <h2 className="mt-3 text-3xl font-black text-white">
              Líderes del Universo VYRO
            </h2>

            <p className="mt-2 text-gray-400">
              Reconocimiento por regalos, energía, audiencia y creación.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              void loadRanking();
            }}
            disabled={loading}
            className="rounded-2xl border border-cyan-400/30 bg-cyan-500/10 px-5 py-3 font-bold text-cyan-300 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Actualizar ranking
          </button>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {rankingTypes.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => {
                setRankingType(type.id);
              }}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                rankingType === type.id
                  ? "bg-cyan-500 text-black"
                  : "border border-white/10 bg-white/5 text-gray-300 hover:border-cyan-400/50"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {rankingPeriods.map((period) => (
            <button
              key={period.id}
              type="button"
              onClick={() => {
                setRankingPeriod(period.id);
              }}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                rankingPeriod === period.id
                  ? "bg-white text-black"
                  : "border border-white/10 text-gray-400 hover:text-white"
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 md:p-8">
        {loading ? (
          <div className="flex min-h-52 items-center justify-center">
            <LoaderCircle className="animate-spin text-cyan-400" />
          </div>
        ) : null}

        {!loading && error ? (
          <div
            role="alert"
            className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-200"
          >
            {error}
          </div>
        ) : null}

        {!loading && !error && entries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 px-6 py-12 text-center">
            {renderRankingIcon(rankingType)}

            <h3 className="mt-4 text-xl font-bold text-white">
              El ranking espera a sus primeras estrellas
            </h3>

            <p className="mt-2 text-gray-400">
              La actividad de los próximos LIVE aparecerá aquí.
            </p>
          </div>
        ) : null}

        {!loading && !error && entries.length > 0 ? (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              {topThree.map((entry, index) => (
                <article
                  key={entry.id}
                  className="rounded-3xl border border-cyan-400/20 bg-gradient-to-b from-cyan-500/10 to-transparent p-6 text-center"
                >
                  <div className="text-4xl">
                    {index === 0
                      ? "👑"
                      : index === 1
                        ? "🥈"
                        : "🥉"}
                  </div>

                  <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                    Posición {index + 1}
                  </p>

                  <h3 className="mt-2 truncate text-lg font-black text-white">
                    {getUserLabel(entry.user_id)}
                  </h3>

                  <div className="mt-4 flex items-center justify-center gap-2 text-2xl font-black text-white">
                    <Flame className="text-cyan-400" />
                    {formatScore(entry.score)}
                  </div>
                </article>
              ))}
            </div>

            {remainingEntries.length > 0 ? (
              <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
                {remainingEntries.map((entry, index) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between gap-4 border-b border-white/5 px-5 py-4 last:border-b-0"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5 font-black text-gray-300">
                        {index + 4}
                      </span>

                      <div className="min-w-0">
                        <p className="truncate font-bold text-white">
                          {getUserLabel(entry.user_id)}
                        </p>

                        <p className="text-xs text-gray-500">
                          {entry.reactions_sent} reacciones ·{" "}
                          {entry.gifts_sent} regalos
                        </p>
                      </div>
                    </div>

                    <strong className="shrink-0 text-cyan-400">
                      {formatScore(entry.score)}
                    </strong>
                  </div>
                ))}
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </section>
  );
}

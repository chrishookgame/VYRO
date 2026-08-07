"use client";

import type {
  ComponentType,
} from "react";

import {
  Activity,
  BarChart3,
  CircleEqual,
  Flag,
  Gauge,
  Swords,
  Trophy,
  Zap,
} from "lucide-react";

import type {
  BattleAnalyticsSnapshot,
} from "./types";

interface BattleAnalyticsProps {
  analytics: BattleAnalyticsSnapshot;
}

interface AnalyticsCardProps {
  label: string;
  value: string | number;
  icon: ComponentType<{
    size?: number;
    className?: string;
  }>;
}

function AnalyticsCard({
  label,
  value,
  icon: Icon,
}: AnalyticsCardProps) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
      <div className="flex items-center justify-between gap-4">
        <Icon
          size={22}
          className="text-violet-200"
        />

        <span className="text-2xl font-black text-white">
          {value}
        </span>
      </div>

      <p className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-white/40">
        {label}
      </p>
    </article>
  );
}

export default function BattleAnalytics({
  analytics,
}: BattleAnalyticsProps) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-violet-400/15 bg-[#090B14]">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-6 py-5">
        <div>
          <div className="flex items-center gap-2 text-violet-200">
            <BarChart3 size={20} />

            <p className="text-xs font-black uppercase tracking-[0.24em]">
              Battle Analytics
            </p>
          </div>

          <h2 className="mt-2 text-2xl font-black text-white">
            Rendimiento de la serie
          </h2>
        </div>

        <span className="rounded-full border border-violet-300/15 bg-violet-300/[0.06] px-4 py-2 text-xs font-black text-violet-100/60">
          {analytics.seriesFinished
            ? "Serie finalizada"
            : "En tiempo real"}
        </span>
      </header>

      <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <AnalyticsCard
          label="Rondas iniciadas"
          value={analytics.roundsStarted}
          icon={Flag}
        />

        <AnalyticsCard
          label="Rondas completadas"
          value={analytics.completedRounds}
          icon={Swords}
        />

        <AnalyticsCard
          label="Victorias"
          value={analytics.victories}
          icon={Trophy}
        />

        <AnalyticsCard
          label="Empates"
          value={analytics.draws}
          icon={CircleEqual}
        />

        <AnalyticsCard
          label="Progreso"
          value={`${analytics.completionPercent}%`}
          icon={Gauge}
        />

        <AnalyticsCard
          label="Rondas decisivas"
          value={`${analytics.decisiveRate}%`}
          icon={Zap}
        />

        <AnalyticsCard
          label="Tasa de empate"
          value={`${analytics.drawRate}%`}
          icon={Activity}
        />

        <AnalyticsCard
          label="Marcador"
          value={`${analytics.leftWins} - ${analytics.rightWins}`}
          icon={BarChart3}
        />
      </div>

      <div className="border-t border-white/10 px-6 py-5">
        <div className="h-2 overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-violet-300 transition-all duration-700"
            style={{
              width:
                `${analytics.completionPercent}%`,
            }}
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-white/35">
          <span>
            {analytics.totalEvents} eventos registrados
          </span>

          <span>
            {analytics.completedRounds} de{" "}
            {analytics.totalRounds} rondas
          </span>
        </div>
      </div>
    </section>
  );
}

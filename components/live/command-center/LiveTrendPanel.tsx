import {
  Flame,
  Trophy,
  TrendingUp,
} from "lucide-react";

interface LiveTrendPanelProps {
  growthPercent: number;
  rankPosition: number;
  momentum: "rising" | "stable" | "falling";
}

export default function LiveTrendPanel({
  growthPercent,
  rankPosition,
  momentum,
}: LiveTrendPanelProps) {
  const momentumLabel =
    momentum === "rising"
      ? "Subiendo"
      : momentum === "falling"
        ? "Bajando"
        : "Estable";

  return (
    <section className="rounded-3xl border border-cyan-400/15 bg-white/[0.035] p-5 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
            Tendencia
          </p>

          <h3 className="mt-2 text-xl font-black text-white">
            Momento del LIVE
          </h3>
        </div>

        <TrendingUp className="text-cyan-300" />
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <TrendMetric
          label="Crecimiento"
          value={`${growthPercent}%`}
          icon={TrendingUp}
        />

        <TrendMetric
          label="Ranking"
          value={`#${rankPosition}`}
          icon={Trophy}
        />

        <TrendMetric
          label="Impulso"
          value={momentumLabel}
          icon={Flame}
        />
      </div>
    </section>
  );
}

interface TrendMetricProps {
  label: string;
  value: string;
  icon: React.ComponentType<{
    size?: number;
    className?: string;
  }>;
}

function TrendMetric({
  label,
  value,
  icon: Icon,
}: TrendMetricProps) {
  return (
    <div className="rounded-2xl border border-white/5 bg-black/20 p-4 text-center">
      <Icon
        size={18}
        className="mx-auto text-cyan-300"
      />

      <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-gray-500">
        {label}
      </p>

      <p className="mt-1 font-black text-white">
        {value}
      </p>
    </div>
  );
}

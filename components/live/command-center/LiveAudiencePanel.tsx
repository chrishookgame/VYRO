import {
  Globe2,
  TrendingUp,
  Users,
} from "lucide-react";

interface LiveAudiencePanelProps {
  activeViewers: number;
  peakViewers: number;
  totalJoins: number;
}

export default function LiveAudiencePanel({
  activeViewers,
  peakViewers,
  totalJoins,
}: LiveAudiencePanelProps) {
  return (
    <section className="rounded-3xl border border-cyan-400/15 bg-white/[0.035] p-5 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
            Audiencia
          </p>

          <h3 className="mt-2 text-xl font-black text-white">
            Pulso de espectadores
          </h3>
        </div>

        <Users className="text-cyan-300" />
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <AudienceMetric
          label="Ahora"
          value={activeViewers}
          icon={Users}
        />

        <AudienceMetric
          label="Pico"
          value={peakViewers}
          icon={TrendingUp}
        />

        <AudienceMetric
          label="Entradas"
          value={totalJoins}
          icon={Globe2}
        />
      </div>
    </section>
  );
}

interface AudienceMetricProps {
  label: string;
  value: number;
  icon: React.ComponentType<{
    size?: number;
    className?: string;
  }>;
}

function AudienceMetric({
  label,
  value,
  icon: Icon,
}: AudienceMetricProps) {
  return (
    <div className="rounded-2xl border border-white/5 bg-black/20 p-4 text-center">
      <Icon
        size={18}
        className="mx-auto text-cyan-300"
      />

      <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-black text-white">
        {value}
      </p>
    </div>
  );
}

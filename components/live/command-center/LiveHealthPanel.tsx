import {
  Activity,
  Gauge,
  Radio,
  Wifi,
} from "lucide-react";

interface LiveHealthPanelProps {
  connected: boolean;
  latency: number;
  fps: number;
  bitrate: number;
}

export default function LiveHealthPanel({
  connected,
  latency,
  fps,
  bitrate,
}: LiveHealthPanelProps) {
  return (
    <section className="rounded-3xl border border-cyan-400/15 bg-white/[0.035] p-5 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
            Estado técnico
          </p>

          <h3 className="mt-2 text-xl font-black text-white">
            Salud de transmisión
          </h3>
        </div>

        <Activity className="text-cyan-300" />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <HealthMetric
          label="Realtime"
          value={connected ? "Conectado" : "Reconectando"}
          icon={Wifi}
        />

        <HealthMetric
          label="Latencia"
          value={`${latency} ms`}
          icon={Radio}
        />

        <HealthMetric
          label="FPS"
          value={`${fps}`}
          icon={Gauge}
        />

        <HealthMetric
          label="Bitrate"
          value={`${bitrate} kbps`}
          icon={Activity}
        />
      </div>
    </section>
  );
}

interface HealthMetricProps {
  label: string;
  value: string;
  icon: React.ComponentType<{
    size?: number;
    className?: string;
  }>;
}

function HealthMetric({
  label,
  value,
  icon: Icon,
}: HealthMetricProps) {
  return (
    <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
      <Icon
        size={18}
        className="text-cyan-300"
      />

      <p className="mt-3 text-xs font-semibold text-gray-500">
        {label}
      </p>

      <p className="mt-1 font-black text-white">
        {value}
      </p>
    </div>
  );
}

import {
  Gift,
  MessageCircle,
  Sparkles,
  Zap,
} from "lucide-react";

interface LiveStatsPanelProps {
  reactions: number;
  gifts: number;
  energy: number;
  messages: number;
}

export default function LiveStatsPanel({
  reactions,
  gifts,
  energy,
  messages,
}: LiveStatsPanelProps) {
  return (
    <section className="rounded-3xl border border-cyan-400/15 bg-white/[0.035] p-5 backdrop-blur-xl">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
        Interacción
      </p>

      <h3 className="mt-2 text-xl font-black text-white">
        Actividad en tiempo real
      </h3>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Stat
          label="Reacciones"
          value={reactions}
          icon={Sparkles}
        />

        <Stat
          label="Regalos"
          value={gifts}
          icon={Gift}
        />

        <Stat
          label="Energía"
          value={energy}
          icon={Zap}
        />

        <Stat
          label="Mensajes"
          value={messages}
          icon={MessageCircle}
        />
      </div>
    </section>
  );
}

interface StatProps {
  label: string;
  value: number;
  icon: React.ComponentType<{
    size?: number;
    className?: string;
  }>;
}

function Stat({
  label,
  value,
  icon: Icon,
}: StatProps) {
  return (
    <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
      <Icon
        size={18}
        className="text-cyan-300"
      />

      <p className="mt-3 text-xs font-semibold text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-black text-white">
        {value}
      </p>
    </div>
  );
}

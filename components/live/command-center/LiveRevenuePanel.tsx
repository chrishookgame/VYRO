import {
  Coins,
  Gift,
  TrendingUp,
  WalletCards,
} from "lucide-react";

interface LiveRevenuePanelProps {
  gifts: number;
  grossRevenue: number;
  creatorRevenue: number;
  pendingRevenue: number;
}

export default function LiveRevenuePanel({
  gifts,
  grossRevenue,
  creatorRevenue,
  pendingRevenue,
}: LiveRevenuePanelProps) {
  return (
    <section className="rounded-3xl border border-cyan-400/15 bg-white/[0.035] p-5 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
            Monetización
          </p>

          <h3 className="mt-2 text-xl font-black text-white">
            Rendimiento económico
          </h3>
        </div>

        <WalletCards className="text-cyan-300" />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <RevenueMetric
          label="Regalos"
          value={String(gifts)}
          icon={Gift}
        />

        <RevenueMetric
          label="Generado"
          value={`$${grossRevenue.toFixed(2)}`}
          icon={Coins}
        />

        <RevenueMetric
          label="Creador"
          value={`$${creatorRevenue.toFixed(2)}`}
          icon={TrendingUp}
        />

        <RevenueMetric
          label="Pendiente"
          value={`$${pendingRevenue.toFixed(2)}`}
          icon={WalletCards}
        />
      </div>
    </section>
  );
}

interface RevenueMetricProps {
  label: string;
  value: string;
  icon: React.ComponentType<{
    size?: number;
    className?: string;
  }>;
}

function RevenueMetric({
  label,
  value,
  icon: Icon,
}: RevenueMetricProps) {
  return (
    <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
      <Icon
        size={18}
        className="text-cyan-300"
      />

      <p className="mt-3 text-xs font-semibold text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-xl font-black text-white">
        {value}
      </p>
    </div>
  );
}

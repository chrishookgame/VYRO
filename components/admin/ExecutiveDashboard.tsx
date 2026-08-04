"use client";

export type ExecutiveStats = {
  totalUsers: number;
  activeUsers: number;
  pendingWithdraws: number;
  totalRevenue: number;
  activeLives: number;
  marketplaceSales: number;
  academyStudents: number;
  aiRequests: number;
};

type Props = {
  stats: ExecutiveStats;
};

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-900 p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <span className="text-4xl">{icon}</span>

        <span className="text-3xl font-bold text-cyan-400">
          {value}
        </span>
      </div>

      <p className="mt-4 text-slate-300">
        {title}
      </p>
    </div>
  );
}

export default function ExecutiveDashboard({
  stats,
}: Props) {

  return (

    <section className="space-y-8">

      <div>

        <h1 className="text-4xl font-bold text-white">
          Executive Dashboard
        </h1>

        <p className="mt-2 text-slate-400">
          Centro de Control Global de VYRO
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Usuarios"
          value={stats.totalUsers}
          icon="👥"
        />

        <StatCard
          title="Usuarios Activos"
          value={stats.activeUsers}
          icon="🟢"
        />

        <StatCard
          title="Retiros Pendientes"
          value={stats.pendingWithdraws}
          icon="💸"
        />

        <StatCard
          title="Ingresos"
          value={`$${stats.totalRevenue}`}
          icon="💰"
        />

        <StatCard
          title="Lives"
          value={stats.activeLives}
          icon="📺"
        />

        <StatCard
          title="Marketplace"
          value={stats.marketplaceSales}
          icon="🛒"
        />

        <StatCard
          title="Academy"
          value={stats.academyStudents}
          icon="🎓"
        />

        <StatCard
          title="IA"
          value={stats.aiRequests}
          icon="🤖"
        />

      </div>

    </section>

  );

}

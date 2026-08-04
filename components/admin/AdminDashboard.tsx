"use client";

type AdminDashboardProps = {
  totalUsers: number;
  activeUsers: number;
  pendingWithdrawals: number;
  totalRevenue: number;
};

export default function AdminDashboard({
  totalUsers,
  activeUsers,
  pendingWithdrawals,
  totalRevenue,
}: AdminDashboardProps) {

  const cards = [
    {
      title: "Usuarios",
      value: totalUsers,
      color: "text-cyan-400",
      icon: "👥",
    },
    {
      title: "Activos",
      value: activeUsers,
      color: "text-green-400",
      icon: "🟢",
    },
    {
      title: "Retiros Pendientes",
      value: pendingWithdrawals,
      color: "text-yellow-400",
      icon: "💸",
    },
    {
      title: "Ingresos",
      value: `$${totalRevenue.toFixed(2)}`,
      color: "text-emerald-400",
      icon: "💰",
    },
  ];

  return (
    <main className="space-y-8">

      <header>
        <h1 className="text-4xl font-bold text-white">
          Admin Maestro
        </h1>

        <p className="mt-2 text-slate-400">
          Centro de control del ecosistema VYRO
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        {cards.map((card) => (

          <article
            key={card.title}
            className="rounded-3xl bg-slate-900 p-6 shadow-xl"
          >

            <div className="flex items-center justify-between">

              <span className="text-4xl">
                {card.icon}
              </span>

              <span className={`text-3xl font-bold ${card.color}`}>
                {card.value}
              </span>

            </div>

            <h2 className="mt-5 text-lg font-semibold text-white">
              {card.title}
            </h2>

          </article>

        ))}

      </section>

    </main>
  );

}

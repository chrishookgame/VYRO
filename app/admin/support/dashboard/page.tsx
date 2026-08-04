export default function SupportDashboardPage() {

  const stats = [
    { title: "Tickets abiertos", value: 24, icon: "🎫" },
    { title: "En revisión", value: 8, icon: "🟡" },
    { title: "Urgentes", value: 3, icon: "🔴" },
    { title: "Resueltos hoy", value: 42, icon: "✅" },
    { title: "Admins conectados", value: 5, icon: "👨‍💼" },
    { title: "Tiempo promedio", value: "4 min", icon: "⏱️" },
  ];

  return (
    <main className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold">
          💬 Dashboard de Soporte
        </h1>

        <p className="mt-2 text-slate-400">
          Centro de monitoreo del equipo de soporte.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        {stats.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
          >
            <div className="flex items-center justify-between">

              <span className="text-4xl">
                {item.icon}
              </span>

              <span className="text-3xl font-bold text-cyan-400">
                {item.value}
              </span>

            </div>

            <p className="mt-4 text-slate-300">
              {item.title}
            </p>

          </div>
        ))}

      </div>

    </main>
  );
}

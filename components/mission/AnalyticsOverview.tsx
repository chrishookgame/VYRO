import {
  BarChart3,
  Eye,
  Radio,
  TrendingUp,
  UsersRound,
  Video,
} from "lucide-react";

const metrics = [
  {
    label: "Visualizaciones",
    value: "14.2K",
    change: "+18%",
    icon: Eye,
  },
  {
    label: "Seguidores",
    value: "892",
    change: "+34",
    icon: UsersRound,
  },
  {
    label: "Videos publicados",
    value: "12",
    change: "+2",
    icon: Video,
  },
  {
    label: "VYRO Live",
    value: "4",
    change: "+1",
    icon: Radio,
  },
];

export default function AnalyticsOverview() {
  return (
    <section className="rounded-3xl border border-white/10 bg-[#0B1220] p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">
            VYRO Analytics
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">
            Rendimiento del ecosistema
          </h2>
        </div>

        <BarChart3 className="text-cyan-400" />
      </div>

      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <article
              key={metric.label}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/10">
                  <Icon className="text-cyan-400" size={21} />
                </div>

                <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-3 py-1 text-sm font-bold text-green-300">
                  <TrendingUp size={15} />
                  {metric.change}
                </span>
              </div>

              <p className="mt-5 text-sm text-gray-400">
                {metric.label}
              </p>

              <p className="mt-2 text-3xl font-black text-white">
                {metric.value}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
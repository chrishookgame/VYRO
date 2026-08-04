import {
  BookOpenCheck,
  CheckCircle2,
  Clock3,
  Radio,
  Video,
} from "lucide-react";

const activities = [
  {
    title: "Video listo para publicar",
    description: "Tu proyecto fue analizado por VYRO AI.",
    time: "Hace 12 min",
    icon: Video,
  },
  {
    title: "VYRO Live programado",
    description: "La transmisión está preparada para hoy a las 20:30.",
    time: "Hace 35 min",
    icon: Radio,
  },
  {
    title: "Curso actualizado",
    description: "Se agregó una nueva lección en VYRO Academy.",
    time: "Hace 1 h",
    icon: BookOpenCheck,
  },
];

export default function ActivityFeed() {
  return (
    <section className="rounded-3xl border border-white/10 bg-[#0B1220] p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">
            Actividad reciente
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">
            Lo que está pasando en VYRO
          </h2>
        </div>

        <Clock3 className="text-cyan-400" />
      </div>

      <div className="mt-7 space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;

          return (
            <article
              key={activity.title}
              className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/10">
                <Icon className="text-cyan-400" size={22} />
              </div>

              <div className="flex-1">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="font-bold text-white">
                    {activity.title}
                  </h3>

                  <span className="text-sm text-gray-500">
                    {activity.time}
                  </span>
                </div>

                <p className="mt-2 text-sm leading-6 text-gray-400">
                  {activity.description}
                </p>
              </div>

              <CheckCircle2
                className="shrink-0 text-green-400"
                size={21}
              />
            </article>
          );
        })}
      </div>
    </section>
  );
}
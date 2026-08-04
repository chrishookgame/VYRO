import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  Rocket,
} from "lucide-react";

type TimelineItem = {
  id: string;
  title: string;
  description: string;
  status: "completed" | "current" | "upcoming";
};

type ProjectTimelineProps = {
  progress: number;
};

export default function ProjectTimeline({
  progress,
}: ProjectTimelineProps) {
  const timeline: TimelineItem[] = [
    {
      id: "idea",
      title: "Idea definida",
      description: "El objetivo principal del proyecto fue establecido.",
      status: "completed",
    },
    {
      id: "production",
      title: "Producción",
      description: "Creación de contenido, recursos y tareas principales.",
      status:
        progress >= 100
          ? "completed"
          : progress > 0
            ? "current"
            : "upcoming",
    },
    {
      id: "launch",
      title: "Lanzamiento",
      description: "Publicación, transmisión o entrega final del proyecto.",
      status: progress >= 100 ? "completed" : "upcoming",
    },
  ];

  return (
    <section className="rounded-3xl border border-white/10 bg-[#0B1220] p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10">
          <CalendarClock className="text-cyan-400" size={24} />
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">
            Project Timeline
          </p>

          <h2 className="mt-1 text-2xl font-black text-white">
            Línea de tiempo
          </h2>
        </div>
      </div>

      <div className="mt-7 space-y-4">
        {timeline.map((item, index) => {
          const Icon =
            item.status === "completed"
              ? CheckCircle2
              : item.status === "current"
                ? Rocket
                : Clock3;

          return (
            <article
              key={item.id}
              className="relative flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/10">
                <Icon
                  className={
                    item.status === "completed"
                      ? "text-green-400"
                      : item.status === "current"
                        ? "text-cyan-400"
                        : "text-gray-500"
                  }
                  size={21}
                />
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-bold text-white">
                    {item.title}
                  </h3>

                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase text-gray-300">
                    Paso {index + 1}
                  </span>
                </div>

                <p className="mt-2 text-sm leading-6 text-gray-400">
                  {item.description}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
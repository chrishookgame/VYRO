import Link from "next/link";
import {
  CalendarDays,
  Clock3,
  Radio,
  UsersRound,
} from "lucide-react";

const events = [
  {
    title: "VYRO Live: Lanzamiento de proyecto",
    date: "Hoy",
    time: "20:30",
    type: "Live",
    href: "/live/studio",
    icon: Radio,
  },
  {
    title: "Reunión del equipo creativo",
    date: "Mañana",
    time: "10:00",
    type: "Connect",
    href: "/connect",
    icon: UsersRound,
  },
  {
    title: "Clase: Estrategia de contenido",
    date: "Sábado",
    time: "18:00",
    type: "Academy",
    href: "/academy",
    icon: CalendarDays,
  },
];

export default function UpcomingEvents() {
  return (
    <section className="rounded-3xl border border-white/10 bg-[#0B1220] p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">
            Agenda VYRO
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">
            Próximos eventos
          </h2>
        </div>

        <CalendarDays className="text-cyan-400" />
      </div>

      <div className="mt-7 space-y-4">
        {events.map((event) => {
          const Icon = event.icon;

          return (
            <Link
              key={`${event.title}-${event.time}`}
              href={event.href}
              className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-cyan-400/40 hover:bg-white/[0.06] sm:flex-row sm:items-center"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/10">
                <Icon className="text-cyan-400" size={23} />
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-white">
                  {event.title}
                </h3>

                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-400">
                  <span>{event.date}</span>

                  <span className="inline-flex items-center gap-1">
                    <Clock3 size={15} />
                    {event.time}
                  </span>

                  <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-cyan-300">
                    {event.type}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
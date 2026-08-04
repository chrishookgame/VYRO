import Link from "next/link";
import {
  CalendarDays,
  Radio,
  Sparkles,
  Users,
  Video,
} from "lucide-react";

const liveOptions = [
  {
    title: "Iniciar transmisión",
    description: "Crea un directo con la identidad de VYRO.",
    href: "/live/studio",
    icon: Radio,
  },
  {
    title: "Explorar directos",
    description: "Descubre transmisiones, cursos y eventos en vivo.",
    href: "/live/watch",
    icon: Video,
  },
  {
    title: "Programar evento",
    description: "Prepara una clase, reunión, conferencia o lanzamiento.",
    href: "/live/schedule",
    icon: CalendarDays,
  },
  {
    title: "Gestionar invitados",
    description: "Invita creadores, profesores, equipos y organizaciones.",
    href: "/live/guests",
    icon: Users,
  },
];

export default function LivePage() {
  return (
    <main className="min-h-screen bg-[#05070A] px-6 py-10 text-white md:px-10">
      <section className="mx-auto max-w-7xl">
        <header className="overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-[#0B1220] to-[#111827] p-8 md:p-10">
          <p className="font-bold uppercase tracking-[0.35em] text-cyan-400">
            VYRO LIVE
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-black md:text-6xl">
            Transmite, enseña, conecta y convierte cada directo en una
            oportunidad.
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-400">
            VYRO LIVE reunirá transmisiones, reuniones, clases, eventos,
            invitados y herramientas inteligentes dentro de una sola
            experiencia.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-300">
              Marca VYRO
            </span>

            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300">
              Chat en tiempo real
            </span>

            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300">
              Invitados
            </span>

            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300">
              VYRO AI
            </span>
          </div>
        </header>

        <section className="mt-10">
          <div className="mb-6 flex items-center gap-3">
            <Sparkles className="text-cyan-400" />

            <h2 className="text-2xl font-black">
              ¿Qué quieres hacer en vivo?
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {liveOptions.map((option) => {
              const Icon = option.icon;

              return (
                <Link
                  key={option.title}
                  href={option.href}
                  className="group rounded-3xl border border-cyan-500/20 bg-[#0B1220] p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-400 hover:bg-[#111B25]"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10">
                    <Icon className="text-cyan-400" size={30} />
                  </div>

                  <h3 className="mt-5 text-xl font-bold">
                    {option.title}
                  </h3>

                  <p className="mt-2 leading-7 text-gray-400">
                    {option.description}
                  </p>

                  <span className="mt-5 inline-block font-semibold text-cyan-400">
                    Abrir experiencia →
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      </section>
    </main>
  );
}
import Link from "next/link";
import {
  CalendarDays,
  Radio,
  Sparkles,
  Users,
  Video,
} from "lucide-react";

import { LiveExplorer } from "@/components/live/explorer";
import { LiveRankingPanel } from "@/components/live/ranking";

const liveOptions = [
  {
    title: "Iniciar transmisión",
    description:
      "Crea una experiencia en directo con toda la identidad VYRO.",
    href: "/live/studio",
    icon: Radio,
  },
  {
    title: "Explorar directos",
    description:
      "Descubre creadores, clases y eventos conectados en tiempo real.",
    href: "#vyro-live-universe",
    icon: Video,
  },
  {
    title: "Programar evento",
    description:
      "Prepara una conferencia, clase, reunión o lanzamiento mundial.",
    href: "/live/schedule",
    icon: CalendarDays,
  },
  {
    title: "Gestionar invitados",
    description:
      "Invita creadores, equipos, profesores y organizaciones.",
    href: "/live/guests",
    icon: Users,
  },
];

export default function LivePage() {
  return (
    <main className="min-h-screen bg-[#03070C] px-6 py-10 text-white md:px-10">
      <section className="mx-auto max-w-7xl">
        <header className="relative overflow-hidden rounded-[2.25rem] border border-cyan-400/20 bg-gradient-to-br from-[#07111D] via-[#0B1C2A] to-[#050A11] p-8 shadow-[0_30px_120px_rgba(0,0,0,0.4)] md:p-12">
          <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-48 left-1/4 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-300" />

              <p className="text-sm font-black uppercase tracking-[0.28em] text-cyan-300">
                VYRO LIVE
              </p>
            </div>

            <h1 className="mt-7 max-w-5xl text-4xl font-black leading-[1.05] md:text-7xl">
              El mundo no solo mira.
              <span className="block bg-gradient-to-r from-cyan-300 via-white to-cyan-400 bg-clip-text text-transparent">
                El mundo participa.
              </span>
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-400">
              Transmite, enseña, conecta y transforma cada directo en una experiencia viva dentro del universo VYRO.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200">
                Realtime
              </span>

              <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-gray-300">
                Gift Galaxy
              </span>

              <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-gray-300">
                Energy Core
              </span>

              <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-gray-300">
                VYRO AI
              </span>
            </div>
          </div>
        </header>

        <section className="mt-10">
          <div className="mb-6 flex items-center gap-3">
            <Sparkles className="text-cyan-400" />

            <h2 className="text-2xl font-black">
              Crea tu próxima experiencia
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {liveOptions.map((option) => {
              const Icon = option.icon;

              return (
                <Link
                  key={option.title}
                  href={option.href}
                  className="group rounded-[1.75rem] border border-white/10 bg-[#07111D] p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-[#0A1825]"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
                    <Icon
                      className="text-cyan-300"
                      size={29}
                    />
                  </div>

                  <h3 className="mt-5 text-xl font-black">
                    {option.title}
                  </h3>

                  <p className="mt-2 leading-7 text-gray-400">
                    {option.description}
                  </p>

                  <span className="mt-5 inline-block font-bold text-cyan-300">
                    Abrir experiencia →
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <div id="vyro-live-universe">
          <LiveExplorer />
        </div>

        <LiveRankingPanel />
      </section>
    </main>
  );
}

import Link from "next/link";
import {
  CalendarDays,
  Radio,
  Sparkles,
  Users,
  Video,
} from "lucide-react";

import { LiveExplorer } from "@/components/live/explorer";
import { LiveCinematicHero } from "@/components/live/hero";
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
        <LiveCinematicHero />

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

import Link from "next/link";
import {
  ArrowRight,
  Brain,
  CalendarDays,
  Radio,
  Sparkles,
} from "lucide-react";

export default function WelcomePanel() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-[#0B1220] via-[#0D1622] to-[#111827] p-8 md:p-10">
      <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative z-10 grid gap-8 xl:grid-cols-[1.4fr_0.6fr] xl:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-sm font-bold text-cyan-300">
              <Sparkles size={16} />
              VYRO Intelligence Online
            </span>

            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300">
              Mission Control v1
            </span>
          </div>

          <p className="mt-8 font-bold uppercase tracking-[0.35em] text-cyan-400">
            Bienvenido a VYRO
          </p>

          <h2 className="mt-4 max-w-4xl text-4xl font-black leading-tight text-white md:text-6xl">
            ¿Qué quieres construir hoy?
          </h2>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-400">
            VYRO no es un lugar para usar herramientas. Es un lugar para
            convertir ideas en realidad.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/ai"
              className="inline-flex items-center gap-3 rounded-2xl bg-cyan-500 px-6 py-4 font-black text-black transition hover:bg-cyan-400"
            >
              <Brain size={20} />
              Empezar con VYRO AI
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/live/studio"
              className="inline-flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-4 font-bold text-red-300 transition hover:bg-red-500/20"
            >
              <Radio size={20} />
              Iniciar VYRO Live
            </Link>
          </div>
        </div>

        <aside className="rounded-3xl border border-white/10 bg-black/20 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">
                Misión del día
              </p>

              <h3 className="mt-2 text-2xl font-black text-white">
                Convierte una idea en una acción
              </h3>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10">
              <CalendarDays className="text-cyan-400" size={28} />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-sm text-gray-400">
                Recomendación de VYRO AI
              </p>

              <p className="mt-2 font-semibold leading-7 text-white">
                Prepara un clip corto antes de tu próxima transmisión para
                aumentar el alcance.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-sm text-gray-500">Proyectos activos</p>
                <p className="mt-2 text-2xl font-black text-white">4</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-sm text-gray-500">Próximo Live</p>
                <p className="mt-2 text-2xl font-black text-white">20:30</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
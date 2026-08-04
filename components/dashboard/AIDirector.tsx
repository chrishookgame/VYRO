"use client";

import {
  Brain,
  Clock,
  ImageIcon,
  Languages,
  Sparkles,
  TrendingUp,
} from "lucide-react";

export default function AIDirector() {
  return (
    <section className="rounded-3xl border border-cyan-500/20 bg-[#0B1220] p-8">
      <header className="flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10">
          <Brain className="text-cyan-400" size={32} />
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">
            VYRO AI
          </p>

          <h2 className="mt-1 text-2xl font-black text-white">
            AI Director
          </h2>

          <p className="text-gray-400">
            Tu copiloto creativo inteligente
          </p>
        </div>
      </header>

      <div className="mt-8 space-y-5">
        <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/[0.03] p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-cyan-400" />

            <span className="text-white">
              Potencial viral
            </span>
          </div>

          <span className="font-bold text-green-400">
            92%
          </span>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/[0.03] p-4">
          <div className="flex items-center gap-3">
            <Clock className="text-cyan-400" />

            <span className="text-white">
              Mejor hora para publicar
            </span>
          </div>

          <span className="font-semibold text-cyan-400">
            20:30
          </span>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/[0.03] p-4">
          <div className="flex items-center gap-3">
            <Languages className="text-cyan-400" />

            <span className="text-white">
              Traducción inteligente
            </span>
          </div>

          <span className="font-semibold text-green-400">
            Lista
          </span>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/[0.03] p-4">
          <div className="flex items-center gap-3">
            <ImageIcon className="text-cyan-400" />

            <span className="text-white">
              VYRO Thumbnail AI
            </span>
          </div>

          <span className="font-semibold text-green-400">
            Lista
          </span>
        </div>
      </div>

      <button
        type="button"
        className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-cyan-500 py-4 font-bold text-black transition duration-300 hover:bg-cyan-400"
      >
        <Sparkles />
        Potenciar con VYRO AI
      </button>
    </section>
  );
}
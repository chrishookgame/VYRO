"use client";

import { Sparkles } from "lucide-react";

export default function AiCore() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-[#111827] to-[#0B1220] p-10">

      <div className="absolute right-10 top-10 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl"></div>

      <div className="relative z-10 flex items-center justify-between">

        <div>

          <p className="text-cyan-400 font-bold uppercase tracking-widest">
            AI DIRECTOR
          </p>

          <h2 className="mt-4 text-5xl font-black text-white">
            Welcome back, Builder
          </h2>

          <p className="mt-4 max-w-xl text-gray-400 text-lg">
            Estoy listo para ayudarte a construir tu próximo proyecto.
            Puedo ayudarte a crear contenido, desarrollar un negocio, organizar reuniones, aprender nuevas habilidades y hacer crecer tu comunidad.
          </p>

          <div className="mt-8 flex gap-4">

            <button className="rounded-2xl bg-cyan-500 px-8 py-4 font-bold text-black transition hover:scale-105">
              Create
            </button>

            <button className="rounded-2xl border border-cyan-500/30 bg-white/5 px-8 py-4 font-bold text-white transition hover:bg-white/10">
              Explore AI
            </button>

          </div>

        </div>

        <div className="flex flex-col items-center">

          <div className="flex h-44 w-44 items-center justify-center rounded-full border-4 border-cyan-400 bg-cyan-500/10 shadow-[0_0_80px_rgba(0,229,255,.35)]">

            <div className="relative flex items-center justify-center">

  <div className="absolute h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl animate-pulse"></div>

  <div className="absolute h-32 w-32 rounded-full border border-cyan-400/30 animate-spin"></div>

  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-cyan-500 shadow-[0_0_50px_rgba(0,229,255,.8)]">

    <Sparkles
      size={50}
      className="text-white"
    />

  </div>

</div>
              
              
            

          </div>

          <p className="mt-6 text-green-400 font-bold">
            ● ONLINE
          </p>

        </div>

      </div>

    </div>
  );
}
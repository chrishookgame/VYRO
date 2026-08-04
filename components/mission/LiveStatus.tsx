import { Radio, Users, Eye, Clock } from "lucide-react";

export default function LiveStatus() {
  return (
    <section className="rounded-3xl border border-red-500/20 bg-gradient-to-br from-[#170B0B] to-[#111827] p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold uppercase tracking-[0.25em] text-red-400">
            VYRO LIVE
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">
            Estado de la transmisión
          </h2>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-red-500/10 px-4 py-2 text-red-300">
          <Radio size={18} />
          OFFLINE
        </div>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="rounded-2xl bg-black/20 p-5">
          <Users className="text-cyan-400" />

          <p className="mt-4 text-sm text-gray-400">
            Participantes
          </p>

          <h3 className="mt-2 text-3xl font-black text-white">
            0
          </h3>
        </div>

        <div className="rounded-2xl bg-black/20 p-5">
          <Eye className="text-cyan-400" />

          <p className="mt-4 text-sm text-gray-400">
            Espectadores
          </p>

          <h3 className="mt-2 text-3xl font-black text-white">
            0
          </h3>
        </div>

        <div className="rounded-2xl bg-black/20 p-5">
          <Clock className="text-cyan-400" />

          <p className="mt-4 text-sm text-gray-400">
            Tiempo
          </p>

          <h3 className="mt-2 text-3xl font-black text-white">
            00:00
          </h3>
        </div>
      </div>
    </section>
  );
}
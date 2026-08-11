import Link from "next/link";
import {
  Bell,
  Command,
  Radio,
  Search,
  Settings,
  UserRound,
} from "lucide-react";

export default function MissionHeader() {
  return (
    <header className="flex flex-col gap-4 border-b border-white/10 bg-[#080C12]/95 px-6 py-4 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/workspace"
          className="flex items-center gap-3"
          aria-label="Ir al Mission Control de VYRO"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-500/10 shadow-[0_0_35px_rgba(34,211,238,0.18)]">
            <Command size={24} className="text-cyan-400" />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-400">
              VYRO
            </p>

            <h1 className="text-lg font-black text-white">
              Mission Control
            </h1>
          </div>
        </Link>

        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/live/studio"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 text-red-300"
            aria-label="Abrir VYRO Live Studio"
          >
            <Radio size={18} />
          </Link>

          <Link
            href="/profile"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-300"
            aria-label="Abrir perfil"
          >
            <UserRound size={18} />
          </Link>
        </div>
      </div>

      <div className="flex flex-1 items-center gap-3 lg:max-w-xl lg:px-8">
        <div className="relative w-full">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <input
            type="search"
            placeholder="Buscar proyectos, transmisiones, cursos o personas..."
            className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400/60 focus:bg-white/[0.07]"
          />
        </div>
      </div>

      <nav className="hidden items-center gap-3 lg:flex">
        <Link
          href="/live/studio"
          className="inline-flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-300 transition hover:bg-red-500/20"
        >
          <Radio size={18} />
          VYRO Live
        </Link>

        <Link
          href="/notifications"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-300 transition hover:border-cyan-400/40 hover:text-cyan-300"
          aria-label="Notificaciones"
        >
          <Bell size={19} />
        </Link>

        <Link
          href="/settings"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-300 transition hover:border-cyan-400/40 hover:text-cyan-300"
          aria-label="Configuración"
        >
          <Settings size={19} />
        </Link>

        <Link
          href="/profile"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-500/10 text-cyan-300 transition hover:bg-cyan-500/20"
          aria-label="Perfil del usuario"
        >
          <UserRound size={19} />
        </Link>
      </nav>
    </header>
  );
}

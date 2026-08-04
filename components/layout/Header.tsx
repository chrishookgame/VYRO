"use client";

import {
  Bell,
  Search,
  Sparkles,
} from "lucide-react";

import { useAuth } from "@/components/auth/AuthProvider";

export default function Header() {
  const {
    user,
  } = useAuth();

  const displayName =
    user?.user_metadata?.username ??
    user?.user_metadata?.full_name ??
    user?.email?.split("@")[0] ??
    "Miembro VYRO";

  const initial =
    displayName
      .trim()
      .charAt(0)
      .toUpperCase() || "V";

  return (
    <header className="flex min-h-20 items-center justify-between border-b border-cyan-500/20 bg-[#0B1220] px-4 py-4 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-black text-white sm:text-3xl">
          COMMAND CENTER
        </h1>

        <p className="text-sm text-gray-400 sm:text-base">
          Bienvenido, {displayName}
        </p>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <div className="hidden w-72 items-center rounded-2xl bg-[#111827] px-4 py-3 lg:flex xl:w-96">
          <Search
            size={20}
            className="text-gray-400"
          />

          <input
            className="ml-3 w-full bg-transparent text-white outline-none placeholder:text-gray-500"
            placeholder="Buscar en VYRO..."
            aria-label="Buscar en VYRO"
          />
        </div>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#111827] text-white transition hover:bg-cyan-500 hover:text-black sm:h-12 sm:w-12"
          aria-label="Abrir asistente"
        >
          <Sparkles size={22} />
        </button>

        <button
          type="button"
          className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-[#111827] text-white transition hover:bg-cyan-500 hover:text-black sm:h-12 sm:w-12"
          aria-label="Abrir notificaciones"
        >
          <Bell size={22} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div
          className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan-500 font-bold text-black sm:h-12 sm:w-12"
          title={displayName}
        >
          {initial}
        </div>
      </div>
    </header>
  );
}

import Link from "next/link";
import {
  Bell,
  ChevronLeft,
  CircleUserRound,
  LifeBuoy,
  Settings,
  UserRound,
} from "lucide-react";

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-[#070B14] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-cyan-300"
        >
          <ChevronLeft size={17} />
          Volver al Dashboard
        </Link>

        <header className="mt-8 rounded-3xl border border-cyan-400/20 bg-[#0B1220] p-6 shadow-2xl sm:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
              <Settings size={26} />
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-400">
                VYRO
              </p>

              <h1 className="mt-1 text-3xl font-black">
                Configuración
              </h1>

              <p className="mt-2 text-sm text-gray-400">
                Administra tu cuenta y preferencias personales.
              </p>
            </div>
          </div>
        </header>

        <section className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/account"
            className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-cyan-400/40 hover:bg-white/[0.06]"
          >
            <CircleUserRound
              size={26}
              className="text-cyan-400"
            />

            <h2 className="mt-5 text-lg font-black">
              Cuenta
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-400">
              Administra acceso, correo y seguridad de tu cuenta.
            </p>
          </Link>
          <Link
            href="/profile"
            className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-cyan-400/40 hover:bg-white/[0.06]"
          >
            <UserRound
              size={26}
              className="text-cyan-400"
            />

            <h2 className="mt-5 text-lg font-black">
              Perfil
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-400">
              Consulta y administra tu identidad dentro de VYRO.
            </p>
          </Link>

          <Link
            href="/notifications"
            className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-cyan-400/40 hover:bg-white/[0.06]"
          >
            <Bell
              size={26}
              className="text-cyan-400"
            />

            <h2 className="mt-5 text-lg font-black">
              Notificaciones
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-400">
              Revisa toda la actividad y alertas de tu cuenta.
            </p>
          </Link>

          <Link
            href="/support"
            className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-cyan-400/40 hover:bg-white/[0.06]"
          >
            <LifeBuoy
              size={26}
              className="text-cyan-400"
            />

            <h2 className="mt-5 text-lg font-black">
              Soporte
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-400">
              Obtén ayuda del equipo de soporte de VYRO.
            </p>
          </Link>
        </section>
      </div>
    </main>
  );
}
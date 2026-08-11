"use client";

import {
  ChevronLeft,
  LogOut,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";

export default function AccountSettings() {
  const router = useRouter();

  const {
    user,
    loading,
    signOut,
  } = useAuth();

  async function handleSignOut() {
    try {
      await signOut();

      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error(
        "VYRO sign out error:",
        error,
      );
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#070B14] px-4 py-8 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-sm text-gray-400">
            Cargando cuenta...
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#070B14] px-4 py-8 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
            <h1 className="text-2xl font-black">
              Sesión requerida
            </h1>

            <p className="mt-3 text-sm text-gray-400">
              Inicia sesión para administrar tu cuenta VYRO.
            </p>

            <Link
              href="/login"
              className="mt-6 inline-flex rounded-2xl bg-cyan-500 px-5 py-3 font-bold text-black transition hover:bg-cyan-400"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070B14] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/settings"
          className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-cyan-300"
        >
          <ChevronLeft size={17} />
          Volver a Configuración
        </Link>

        <header className="mt-8 rounded-3xl border border-cyan-400/20 bg-[#0B1220] p-6 shadow-2xl sm:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
              <UserRound size={27} />
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-400">
                VYRO ACCOUNT
              </p>

              <h1 className="mt-1 text-3xl font-black">
                Cuenta
              </h1>

              <p className="mt-2 text-sm text-gray-400">
                Administra el acceso y la seguridad de tu cuenta.
              </p>
            </div>
          </div>
        </header>

        <section className="mt-6 space-y-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
                <Mail size={21} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                  Correo electrónico
                </p>

                <p className="mt-2 break-all font-semibold text-white">
                  {user.email ?? "Sin correo disponible"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
                <ShieldCheck size={21} />
              </div>

              <div>
                <h2 className="font-black">
                  Seguridad
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-400">
                  Próximamente podrás administrar contraseña,
                  correo electrónico y opciones avanzadas de seguridad.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-red-500/20 bg-red-500/[0.04] p-6">
            <h2 className="font-black text-red-300">
              Sesión
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-400">
              Cierra tu sesión actual de VYRO en este dispositivo.
            </p>

            <button
              type="button"
              onClick={handleSignOut}
              className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-red-400/30 bg-red-500/10 px-5 py-3 font-bold text-red-200 transition hover:bg-red-500/20"
            >
              <LogOut size={18} />
              Cerrar sesión
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

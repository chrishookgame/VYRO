"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Activity,
  ArrowLeft,
  Gift,
  Radio,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

import { useLiveRealtime } from "@/hooks";

export default function LiveWatchPage() {
  const params = useParams<{ roomId: string }>();
  const roomId = params.roomId;

  const {
    connected,
    lastUpdate,
    counterVersion,
    reactionVersion,
    giftVersion,
    rankingVersion,
    eventVersion,
  } = useLiveRealtime(roomId);

  return (
    <main className="min-h-screen bg-[#05070A] px-6 py-8 text-white md:px-10">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/live"
            className="inline-flex items-center gap-2 font-semibold text-cyan-400 transition hover:text-cyan-300"
          >
            <ArrowLeft size={18} />
            Volver a VYRO LIVE
          </Link>

          <div
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold ${
              connected
                ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-300"
                : "border-yellow-400/30 bg-yellow-500/10 text-yellow-300"
            }`}
          >
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                connected
                  ? "animate-pulse bg-emerald-400"
                  : "bg-yellow-400"
              }`}
            />

            {connected
              ? "Realtime conectado"
              : "Conectando Realtime"}
          </div>
        </div>

        <header className="mt-6 rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-[#0B1220] to-[#111827] p-8">
          <div className="flex items-center gap-3">
            <Radio className="text-cyan-400" />

            <p className="font-bold uppercase tracking-[0.3em] text-cyan-400">
              VYRO LIVE ROOM
            </p>
          </div>

          <h1 className="mt-4 text-4xl font-black md:text-5xl">
            Sala conectada en tiempo real
          </h1>

          <p className="mt-4 text-gray-400">
            Room ID:
            <span className="ml-2 font-mono text-cyan-300">
              {roomId}
            </span>
          </p>
        </header>

        <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
          <RealtimeCard
            title="Contadores"
            value={counterVersion}
            icon={Users}
          />

          <RealtimeCard
            title="Reacciones"
            value={reactionVersion}
            icon={Zap}
          />

          <RealtimeCard
            title="Regalos"
            value={giftVersion}
            icon={Gift}
          />

          <RealtimeCard
            title="Ranking"
            value={rankingVersion}
            icon={Trophy}
          />

          <RealtimeCard
            title="Eventos"
            value={eventVersion}
            icon={Activity}
          />
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-[#0B1220] p-6">
          <h2 className="text-xl font-black">
            Última actualización Realtime
          </h2>

          {lastUpdate ? (
            <div className="mt-4 rounded-2xl border border-cyan-500/20 bg-black/30 p-5">
              <p className="font-bold text-cyan-400">
                Tipo: {lastUpdate.type}
              </p>

              <pre className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap break-words text-xs text-gray-300">
                {JSON.stringify(lastUpdate.payload, null, 2)}
              </pre>
            </div>
          ) : (
            <p className="mt-4 text-gray-400">
              Esperando la primera actividad de esta sala.
            </p>
          )}
        </section>
      </section>
    </main>
  );
}

interface RealtimeCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{
    size?: number;
    className?: string;
  }>;
}

function RealtimeCard({
  title,
  value,
  icon: Icon,
}: RealtimeCardProps) {
  return (
    <article className="rounded-3xl border border-cyan-500/20 bg-[#0B1220] p-5">
      <Icon
        size={26}
        className="text-cyan-400"
      />

      <p className="mt-4 text-sm font-semibold text-gray-400">
        {title}
      </p>

      <p className="mt-2 text-3xl font-black">
        {value}
      </p>
    </article>
  );
}

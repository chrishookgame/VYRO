"use client";

import type { ComponentType } from "react";
import {
  useCallback,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Activity,
  ArrowLeft,
  CalendarClock,
  Eye,
  Gift,
  LoaderCircle,
  Radio,
  ShieldCheck,
  Trophy,
  UserRound,
  Users,
  Zap,
} from "lucide-react";

import { useLiveRealtime } from "@/hooks";
import {
  getLiveRoomDetails,
  type LiveRoomDetails,
} from "@/lib/live";

export default function LiveWatchPage() {
  const params = useParams<{ roomId: string }>();
  const roomId = params.roomId;

  const [room, setRoom] =
    useState<LiveRoomDetails | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const {
    connected,
    lastUpdate,
    counterVersion,
    reactionVersion,
    giftVersion,
    rankingVersion,
    eventVersion,
  } = useLiveRealtime(roomId);

  const loadRoom = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const roomDetails =
        await getLiveRoomDetails(roomId);

      setRoom(roomDetails);
    } catch (roomError) {
      setError(
        roomError instanceof Error
          ? roomError.message
          : "No se pudo cargar la sala LIVE.",
      );
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    void loadRoom();
  }, [loadRoom]);

  useEffect(() => {
    if (counterVersion > 0) {
      void loadRoom();
    }
  }, [counterVersion, loadRoom]);

  if (loading && !room) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#05070A] text-white">
        <div className="text-center">
          <LoaderCircle
            size={42}
            className="mx-auto animate-spin text-cyan-400"
          />

          <p className="mt-4 text-gray-400">
            Cargando sala VYRO LIVE...
          </p>
        </div>
      </main>
    );
  }

  if (error && !room) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#05070A] px-6 text-white">
        <section className="max-w-xl rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-center">
          <h1 className="text-2xl font-black">
            No se pudo abrir esta sala
          </h1>

          <p className="mt-4 text-red-200">
            {error}
          </p>

          <Link
            href="/live"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-bold text-black"
          >
            <ArrowLeft size={18} />
            Volver a VYRO LIVE
          </Link>
        </section>
      </main>
    );
  }

  if (!room) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#05070A] px-6 text-white">
        <section className="max-w-xl rounded-3xl border border-white/10 bg-[#0B1220] p-8 text-center">
          <h1 className="text-2xl font-black">
            Esta sala LIVE no existe
          </h1>

          <p className="mt-4 text-gray-400">
            El enlace puede ser incorrecto o la sala fue eliminada.
          </p>

          <Link
            href="/live"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 font-bold text-black"
          >
            <ArrowLeft size={18} />
            Volver a VYRO LIVE
          </Link>
        </section>
      </main>
    );
  }

  const hostName =
    room.host?.fullName ||
    room.host?.username ||
    "Creador VYRO";

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

        <header className="mt-6 overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-[#0B1220] to-[#111827] p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Radio className="text-cyan-400" />

              <p className="font-bold uppercase tracking-[0.3em] text-cyan-400">
                VYRO LIVE ROOM
              </p>
            </div>

            <span className="rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-black uppercase text-red-300">
              {room.status}
            </span>
          </div>

          <h1 className="mt-5 text-4xl font-black md:text-5xl">
            {room.title}
          </h1>

          {room.description ? (
            <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-400">
              {room.description}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-300">
            <div className="inline-flex items-center gap-2">
              <UserRound
                size={18}
                className="text-cyan-400"
              />

              <span>{hostName}</span>

              {room.host?.verified ? (
                <ShieldCheck
                  size={18}
                  className="text-cyan-400"
                />
              ) : null}
            </div>

            <div className="inline-flex items-center gap-2">
              <CalendarClock
                size={18}
                className="text-cyan-400"
              />

              <span>
                {room.startedAt
                  ? new Intl.DateTimeFormat(
                      "es-419",
                      {
                        dateStyle: "medium",
                        timeStyle: "short",
                      },
                    ).format(
                      new Date(room.startedAt),
                    )
                  : "Transmisión aún no iniciada"}
              </span>
            </div>
          </div>
        </header>

        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <MetricCard
            title="Espectadores"
            value={room.counters.activeViewers}
            icon={Eye}
          />

          <MetricCard
            title="Pico de audiencia"
            value={room.counters.peakViewers}
            icon={Users}
          />

          <MetricCard
            title="Reacciones"
            value={room.counters.totalReactions}
            icon={Zap}
          />

          <MetricCard
            title="Regalos"
            value={room.counters.totalGifts}
            icon={Gift}
          />

          <MetricCard
            title="Entradas"
            value={room.counters.totalJoins}
            icon={Activity}
          />
        </section>

        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <RealtimeCard
            title="Reacciones Realtime"
            value={reactionVersion}
            icon={Zap}
          />

          <RealtimeCard
            title="Regalos Realtime"
            value={giftVersion}
            icon={Gift}
          />

          <RealtimeCard
            title="Ranking Realtime"
            value={rankingVersion}
            icon={Trophy}
          />

          <RealtimeCard
            title="Eventos Realtime"
            value={eventVersion}
            icon={Activity}
          />
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-[#0B1220] p-6">
          <h2 className="text-xl font-black">
            Actividad en tiempo real
          </h2>

          {lastUpdate ? (
            <div className="mt-4 rounded-2xl border border-cyan-500/20 bg-black/30 p-5">
              <p className="font-bold text-cyan-400">
                Tipo: {lastUpdate.type}
              </p>

              <pre className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap break-words text-xs text-gray-300">
                {JSON.stringify(
                  lastUpdate.payload,
                  null,
                  2,
                )}
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

interface CardProps {
  title: string;
  value: number;
  icon: ComponentType<{
    size?: number;
    className?: string;
  }>;
}

function MetricCard({
  title,
  value,
  icon: Icon,
}: CardProps) {
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

function RealtimeCard(
  props: CardProps,
) {
  return <MetricCard {...props} />;
}

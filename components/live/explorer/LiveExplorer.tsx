"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Eye,
  Gift,
  LoaderCircle,
  Radio,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

import {
  getLiveExplorerRooms,
  type LiveExplorerRoom,
} from "@/lib/live";
import { supabase } from "@/lib/supabase";

type LiveFilter =
  | "all"
  | "live"
  | "scheduled";

function getHostName(
  room: LiveExplorerRoom,
): string {
  return (
    room.host?.fullName ||
    room.host?.username ||
    "Creador VYRO"
  );
}

function getInitials(
  room: LiveExplorerRoom,
): string {
  return getHostName(room)
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

function isRoomLive(
  status: string,
): boolean {
  return (
    status === "live" ||
    status === "active"
  );
}

function formatNumber(
  value: number,
): string {
  return new Intl.NumberFormat("es-419", {
    notation: value >= 1000
      ? "compact"
      : "standard",
    maximumFractionDigits: 1,
  }).format(value);
}

export default function LiveExplorer() {
  const [rooms, setRooms] =
    useState<LiveExplorerRoom[]>([]);

  const [filter, setFilter] =
    useState<LiveFilter>("all");

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadRooms = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const liveRooms =
        await getLiveExplorerRooms();

      setRooms(liveRooms);
    } catch (roomsError) {
      setError(
        roomsError instanceof Error
          ? roomsError.message
          : "No se pudieron cargar los LIVE.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRooms();
  }, [loadRooms]);

  useEffect(() => {
    const channel = supabase
      .channel("vyro-live-explorer")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "live_room_counters",
        },
        () => {
          void loadRooms();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [loadRooms]);

  const filteredRooms = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return rooms.filter((room) => {
      const matchesFilter =
        filter === "all" ||
        (
          filter === "live" &&
          isRoomLive(room.status)
        ) ||
        (
          filter === "scheduled" &&
          room.status === "scheduled"
        );

      const hostName =
        getHostName(room).toLowerCase();

      const matchesSearch =
        normalizedSearch.length === 0 ||
        room.title
          .toLowerCase()
          .includes(normalizedSearch) ||
        room.description
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        hostName.includes(normalizedSearch);

      return (
        matchesFilter &&
        Boolean(matchesSearch)
      );
    });
  }, [filter, rooms, search]);

  const activeRooms = rooms.filter(
    (room) => isRoomLive(room.status),
  );

  const totalViewers = activeRooms.reduce(
    (total, room) =>
      total +
      room.counters.activeViewers,
    0,
  );

  return (
    <section className="mt-10">
      <div className="relative overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-[#07111D] p-6 shadow-[0_0_80px_rgba(34,211,238,0.08)] md:p-8">
        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="relative">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
                  <Sparkles
                    size={22}
                    className="text-cyan-300"
                  />
                </span>

                <p className="font-black uppercase tracking-[0.28em] text-cyan-300">
                  VYRO LIVE UNIVERSE
                </p>
              </div>

              <h2 className="mt-5 max-w-3xl text-3xl font-black md:text-5xl">
                Descubre transmisiones que están moviendo el mundo.
              </h2>

              <p className="mt-4 max-w-2xl leading-7 text-gray-400">
                Creadores, eventos, clases y experiencias conectadas en tiempo real dentro del universo VYRO.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  En directo
                </p>

                <p className="mt-2 text-3xl font-black text-white">
                  {activeRooms.length}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Audiencia
                </p>

                <p className="mt-2 text-3xl font-black text-white">
                  {formatNumber(totalViewers)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap gap-2">
              <FilterButton
                active={filter === "all"}
                label="Todos"
                onClick={() => {
                  setFilter("all");
                }}
              />

              <FilterButton
                active={filter === "live"}
                label="En vivo"
                onClick={() => {
                  setFilter("live");
                }}
              />

              <FilterButton
                active={filter === "scheduled"}
                label="Programados"
                onClick={() => {
                  setFilter("scheduled");
                }}
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="relative block">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                  }}
                  placeholder="Buscar LIVE o creador"
                  className="w-full rounded-2xl border border-white/10 bg-black/20 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400/50 sm:w-72"
                />
              </label>

              <button
                type="button"
                onClick={() => {
                  void loadRooms();
                }}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-sm font-bold text-cyan-300 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  size={17}
                  className={
                    loading
                      ? "animate-spin"
                      : ""
                  }
                />

                Actualizar
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 flex min-h-72 items-center justify-center rounded-[2rem] border border-white/10 bg-[#07111D]">
          <div className="text-center">
            <LoaderCircle
              size={40}
              className="mx-auto animate-spin text-cyan-400"
            />

            <p className="mt-4 text-gray-400">
              Conectando con el universo LIVE...
            </p>
          </div>
        </div>
      ) : null}

      {!loading && error ? (
        <div
          role="alert"
          className="mt-8 rounded-[2rem] border border-red-500/30 bg-red-500/10 p-7 text-red-200"
        >
          {error}
        </div>
      ) : null}

      {!loading &&
      !error &&
      filteredRooms.length === 0 ? (
        <div className="mt-8 overflow-hidden rounded-[2rem] border border-dashed border-cyan-400/20 bg-[#07111D] px-6 py-16 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.75rem] border border-cyan-400/20 bg-cyan-400/10">
            <Radio
              size={36}
              className="text-cyan-300"
            />
          </div>

          <h3 className="mt-6 text-2xl font-black">
            El próximo gran LIVE está por comenzar
          </h3>

          <p className="mx-auto mt-3 max-w-xl leading-7 text-gray-400">
            Cuando un creador inicie o programe una transmisión, aparecerá aquí automáticamente.
          </p>

          <Link
            href="/live/studio"
            className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-cyan-400 px-6 py-3 font-black text-black transition hover:bg-cyan-300"
          >
            Crear el primer LIVE
            <ArrowUpRight size={18} />
          </Link>
        </div>
      ) : null}

      {!loading &&
      !error &&
      filteredRooms.length > 0 ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredRooms.map((room) => {
            const live =
              isRoomLive(room.status);

            return (
              <article
                key={room.id}
                className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#08131F] transition duration-500 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-[0_25px_80px_rgba(0,0,0,0.35)]"
              >
                <div className="relative flex min-h-60 flex-col justify-between overflow-hidden bg-gradient-to-br from-cyan-500/20 via-[#102337] to-[#07111D] p-6">
                  <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-300/10 blur-3xl transition duration-700 group-hover:scale-125" />

                  <div className="relative flex items-start justify-between gap-4">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-black uppercase tracking-wider ${
                        live
                          ? "border-red-400/30 bg-red-500/15 text-red-300"
                          : "border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          live
                            ? "animate-pulse bg-red-400"
                            : "bg-cyan-400"
                        }`}
                      />

                      {live
                        ? "LIVE"
                        : "PROGRAMADO"}
                    </span>

                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-2 text-xs font-bold text-white backdrop-blur-xl">
                      <Eye size={15} />
                      {formatNumber(
                        room.counters
                          .activeViewers,
                      )}
                    </span>
                  </div>

                  <div className="relative mt-16">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
                      EXPERIENCIA VYRO
                    </p>

                    <h3 className="mt-3 line-clamp-2 text-2xl font-black leading-tight">
                      {room.title}
                    </h3>

                    {room.description ? (
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-300">
                        {room.description}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-cyan-400/20 bg-cyan-400/10 font-black text-cyan-200">
                      {room.host?.avatarUrl ? (
                        <div
                          className="absolute inset-0 bg-cover bg-center"
                          style={{
                            backgroundImage:
                              `url("${room.host.avatarUrl}")`,
                          }}
                        />
                      ) : (
                        getInitials(room)
                      )}

                      {live ? (
                        <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-[#08131F] bg-emerald-400" />
                      ) : null}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-black">
                          {getHostName(room)}
                        </p>

                        {room.host?.verified ? (
                          <ShieldCheck
                            size={17}
                            className="shrink-0 text-cyan-400"
                          />
                        ) : null}
                      </div>

                      <p className="truncate text-sm text-gray-500">
                        @
                        {room.host?.username ||
                          "vyro.creator"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-2">
                    <MiniMetric
                      icon="energy"
                      value={room.counters.totalReactions}
                    />

                    <MiniMetric
                      icon="gifts"
                      value={room.counters.totalGifts}
                    />

                    <MiniMetric
                      icon="audience"
                      value={room.counters.peakViewers}
                    />
                  </div>

                  <Link
                    href={`/live/watch/${room.id}`}
                    className="mt-5 flex w-full items-center justify-between rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-4 font-black text-cyan-200 transition hover:bg-cyan-400 hover:text-black"
                  >
                    <span>
                      {live
                        ? "Entrar al LIVE"
                        : "Ver sala"}
                    </span>

                    <ArrowUpRight size={19} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}

interface FilterButtonProps {
  active: boolean;
  label: string;
  onClick: () => void;
}

function FilterButton({
  active,
  label,
  onClick,
}: FilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
        active
          ? "bg-cyan-400 text-black"
          : "border border-white/10 bg-white/[0.04] text-gray-400 hover:border-cyan-400/30 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

interface MiniMetricProps {
  icon: "energy" | "gifts" | "audience";
  value: number;
}

function MiniMetric({
  icon,
  value,
}: MiniMetricProps) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.03] px-3 py-3 text-center">
      {icon === "energy" ? (
        <Zap
          size={16}
          className="mx-auto text-cyan-400"
        />
      ) : null}

      {icon === "gifts" ? (
        <Gift
          size={16}
          className="mx-auto text-cyan-400"
        />
      ) : null}

      {icon === "audience" ? (
        <Users
          size={16}
          className="mx-auto text-cyan-400"
        />
      ) : null}

      <p className="mt-2 text-sm font-black">
        {formatNumber(value)}
      </p>
    </div>
  );
}

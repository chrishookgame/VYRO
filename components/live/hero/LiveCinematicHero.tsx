"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Bot,
  Gift,
  Globe2,
  LoaderCircle,
  Radio,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

import {
  getLiveGlobalPulse,
  type LiveGlobalPulse,
} from "@/lib/live";
import { supabase } from "@/lib/supabase";

const orbitItems = [
  {
    label: "Realtime",
    icon: Radio,
    position:
      "left-[8%] top-[18%] animate-[pulse_3s_ease-in-out_infinite]",
  },
  {
    label: "VYRO AI",
    icon: Bot,
    position:
      "right-[7%] top-[14%] animate-[pulse_4s_ease-in-out_infinite]",
  },
  {
    label: "Energy Core",
    icon: Zap,
    position:
      "bottom-[14%] left-[10%] animate-[pulse_3.5s_ease-in-out_infinite]",
  },
  {
    label: "Global",
    icon: Globe2,
    position:
      "bottom-[12%] right-[8%] animate-[pulse_4.5s_ease-in-out_infinite]",
  },
];

const emptyPulse: LiveGlobalPulse = {
  activeRooms: 0,
  scheduledRooms: 0,
  activeViewers: 0,
  totalReactions: 0,
  totalGifts: 0,
  updatedAt: "",
};

function formatNumber(value: number): string {
  return new Intl.NumberFormat("es-419", {
    notation: value >= 1000
      ? "compact"
      : "standard",
    maximumFractionDigits: 1,
  }).format(value);
}

export default function LiveCinematicHero() {
  const [pulse, setPulse] =
    useState<LiveGlobalPulse>(emptyPulse);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadPulse = useCallback(async () => {
    try {
      const globalPulse =
        await getLiveGlobalPulse();

      setPulse(globalPulse);
      setError("");
    } catch (pulseError) {
      setError(
        pulseError instanceof Error
          ? pulseError.message
          : "No se pudo cargar el pulso global LIVE.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPulse();

    const channel = supabase
      .channel("vyro-live-global-pulse")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "live_room_counters",
        },
        () => {
          void loadPulse();
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "live_rooms",
        },
        () => {
          void loadPulse();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [loadPulse]);

  return (
    <header className="relative isolate min-h-[680px] overflow-hidden rounded-[2.5rem] border border-cyan-300/20 bg-[#02070D] shadow-[0_40px_140px_rgba(0,0,0,0.55)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10" />
        <div className="absolute left-1/2 top-1/2 h-[540px] w-[540px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10" />
        <div className="absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/20" />

        <div className="absolute -left-48 -top-48 h-[520px] w-[520px] rounded-full bg-cyan-400/10 blur-[120px]" />
        <div className="absolute -bottom-56 -right-40 h-[560px] w-[560px] rounded-full bg-blue-600/15 blur-[140px]" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/10 blur-[90px]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.035)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(circle_at_center,black,transparent_80%)]" />
      </div>

      {orbitItems.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            className={`pointer-events-none absolute hidden items-center gap-2 rounded-2xl border border-cyan-300/20 bg-[#07131F]/80 px-4 py-3 text-xs font-bold text-cyan-200 shadow-[0_0_35px_rgba(34,211,238,0.08)] backdrop-blur-xl lg:flex ${item.position}`}
          >
            <Icon size={16} />
            {item.label}
          </div>
        );
      })}

      <div className="relative z-10 flex min-h-[680px] flex-col items-center justify-center px-7 py-16 text-center md:px-14">
        <div className="inline-flex items-center gap-3 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-5 py-2.5 shadow-[0_0_40px_rgba(34,211,238,0.08)]">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-300 opacity-70" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-cyan-300" />
          </span>

          <span className="text-xs font-black uppercase tracking-[0.32em] text-cyan-200">
            VYRO LIVE UNIVERSE
          </span>
        </div>

        <div className="relative mt-10">
          <div className="absolute inset-0 scale-110 bg-cyan-300/10 blur-[70px]" />

          <h1 className="relative max-w-6xl text-5xl font-black leading-[0.96] tracking-[-0.05em] md:text-7xl xl:text-8xl">
            El futuro no se mira.
            <span className="mt-3 block bg-gradient-to-r from-cyan-300 via-white to-cyan-400 bg-clip-text text-transparent">
              Se vive en VYRO.
            </span>
          </h1>
        </div>

        <p className="mt-8 max-w-3xl text-lg leading-8 text-gray-400 md:text-xl">
          Un universo en tiempo real donde creadores, comunidades,
          conocimiento, energía y tecnología se convierten en experiencias
          que el mundo puede sentir.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/live/studio"
            className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-cyan-300 px-7 py-4 font-black text-black shadow-[0_0_45px_rgba(34,211,238,0.22)] transition duration-300 hover:-translate-y-1 hover:bg-white"
          >
            <Radio size={20} />
            Iniciar experiencia LIVE
            <ArrowUpRight
              size={19}
              className="transition group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>

          <Link
            href="#vyro-live-universe"
            className="inline-flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-7 py-4 font-black text-white backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-cyan-300/10"
          >
            <Sparkles size={20} className="text-cyan-300" />
            Explorar el universo
          </Link>
        </div>

        <div className="mt-14 grid w-full max-w-5xl grid-cols-2 gap-3 md:grid-cols-5">
          <HeroMetric
            icon={Radio}
            label="LIVE activos"
            value={
              loading
                ? "..."
                : formatNumber(pulse.activeRooms)
            }
          />

          <HeroMetric
            icon={Users}
            label="Audiencia"
            value={
              loading
                ? "..."
                : formatNumber(pulse.activeViewers)
            }
          />

          <HeroMetric
            icon={Zap}
            label="Reacciones"
            value={
              loading
                ? "..."
                : formatNumber(pulse.totalReactions)
            }
          />

          <HeroMetric
            icon={Gift}
            label="Regalos"
            value={
              loading
                ? "..."
                : formatNumber(pulse.totalGifts)
            }
          />

          <HeroMetric
            icon={Globe2}
            label="Programados"
            value={
              loading
                ? "..."
                : formatNumber(pulse.scheduledRooms)
            }
          />
        </div>

        {loading ? (
          <div className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-gray-500">
            <LoaderCircle
              size={15}
              className="animate-spin text-cyan-400"
            />
            Sincronizando el pulso global...
          </div>
        ) : null}

        {!loading && error ? (
          <p className="mt-5 text-xs font-semibold text-red-300">
            {error}
          </p>
        ) : null}
      </div>
    </header>
  );
}

interface HeroMetricProps {
  icon: React.ComponentType<{
    size?: number;
    className?: string;
  }>;
  label: string;
  value: string;
}

function HeroMetric({
  icon: Icon,
  label,
  value,
}: HeroMetricProps) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-4 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-cyan-300/[0.06]">
      <Icon
        size={19}
        className="mx-auto text-cyan-300"
      />

      <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500">
        {label}
      </p>

      <p className="mt-1 font-black text-white">
        {value}
      </p>
    </div>
  );
}

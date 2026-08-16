"use client";

import {
  ChevronDown,
  Clock3,
  Gift,
  Heart,
  MessageCircle,
  Search,
  UserPlus,
  Users,
} from "lucide-react";
import {
  useState,
  type ReactNode,
} from "react";

type ControlPanel =
  | "viewers"
  | "reactions"
  | "messages"
  | "gifts"
  | "activity"
  | "search"
  | "guests"
  | null;

type VyroCreatorControlStripProps = {
  activeViewers: number;
  peakViewers: number;
  totalJoins: number;
  reactions: number;
  messages: number;
  gifts: number;
  duration: string;
  searchContent?: ReactNode;
  guestContent?: ReactNode;
};

type ControlButtonProps = {
  active: boolean;
  label: string;
  value?: number;
  icon: ReactNode;
  onClick: () => void;
};

function ControlButton({
  active,
  label,
  value,
  icon,
  onClick,
}: ControlButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={active}
      className={[
        "group flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5",
        "text-xs font-bold text-white transition",
        active
          ? "border-cyan-300/50 bg-cyan-400/15 shadow-[0_0_24px_rgba(34,211,238,0.12)]"
          : "border-white/10 bg-white/[0.07] hover:border-white/20 hover:bg-white/[0.12]",
      ].join(" ")}
    >
      {icon}

      {typeof value === "number" ? (
        <span className="tabular-nums">
          {value}
        </span>
      ) : null}

      <span className="hidden text-white/55 2xl:inline">
        {label}
      </span>

      <ChevronDown
        size={12}
        className={[
          "text-white/35 transition-transform",
          active ? "rotate-180 text-cyan-300" : "",
        ].join(" ")}
      />
    </button>
  );
}

export function VyroCreatorControlStrip({
  activeViewers,
  peakViewers,
  totalJoins,
  reactions,
  messages,
  gifts,
  duration,
  searchContent,
  guestContent,
}: VyroCreatorControlStripProps) {
  const [
    openPanel,
    setOpenPanel,
  ] = useState<ControlPanel>(null);

  function togglePanel(panel: Exclude<ControlPanel, null>) {
    setOpenPanel((current) =>
      current === panel ? null : panel,
    );
  }

  return (
    <div className="relative w-full">
      <div className="flex w-full items-center gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-black/70 px-3 py-2 shadow-2xl backdrop-blur-xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-4">
        <div className="flex shrink-0 items-center gap-2 rounded-full bg-red-500 px-3 py-1.5 text-xs font-black text-white shadow-lg">
          <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
          ON AIR
        </div>

        <ControlButton
          active={openPanel === "viewers"}
          label="Viewers"
          value={activeViewers}
          icon={
            <Users
              size={14}
              className="text-cyan-300"
            />
          }
          onClick={() => togglePanel("viewers")}
        />

        <ControlButton
          active={openPanel === "reactions"}
          label="Reactions"
          value={reactions}
          icon={
            <Heart
              size={14}
              className="text-pink-300"
            />
          }
          onClick={() => togglePanel("reactions")}
        />

        <ControlButton
          active={openPanel === "messages"}
          label="Chat"
          value={messages}
          icon={
            <MessageCircle
              size={14}
              className="text-violet-300"
            />
          }
          onClick={() => togglePanel("messages")}
        />

        <ControlButton
          active={openPanel === "gifts"}
          label="Gifts"
          value={gifts}
          icon={
            <Gift
              size={14}
              className="text-amber-300"
            />
          }
          onClick={() => togglePanel("gifts")}
        />

        <ControlButton
          active={openPanel === "activity"}
          label="Activity"
          value={totalJoins}
          icon={
            <UserPlus
              size={14}
              className="text-emerald-300"
            />
          }
          onClick={() => togglePanel("activity")}
        />

        <ControlButton
          active={openPanel === "search"}
          label="Buscar"
          icon={
            <Search
              size={14}
              className="text-cyan-300"
            />
          }
          onClick={() => togglePanel("search")}
        />

        <ControlButton
          active={openPanel === "guests"}
          label="Guests"
          icon={
            <Users
              size={14}
              className="text-fuchsia-300"
            />
          }
          onClick={() => togglePanel("guests")}
        />

        <div className="ml-auto flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-xs font-black tabular-nums text-white">
          <Clock3
            size={14}
            className="text-cyan-300"
          />
          {duration}
        </div>
      </div>

      {openPanel ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.6rem)] z-50">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#080B10]/95 shadow-[0_24px_80px_rgba(0,0,0,0.65)] backdrop-blur-2xl">
            {openPanel === "viewers" ? (
              <div className="grid gap-3 p-4 sm:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-white/40">
                    Viendo ahora
                  </p>
                  <p className="mt-2 text-2xl font-black text-cyan-300">
                    {activeViewers}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-white/40">
                    Pico LIVE
                  </p>
                  <p className="mt-2 text-2xl font-black text-white">
                    {peakViewers}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-white/40">
                    Entradas
                  </p>
                  <p className="mt-2 text-2xl font-black text-white">
                    {totalJoins}
                  </p>
                </div>
              </div>
            ) : null}

            {openPanel === "reactions" ? (
              <div className="p-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-300">
                  Reacciones LIVE
                </p>
                <p className="mt-2 text-3xl font-black">
                  {reactions}
                </p>
                <p className="mt-2 text-sm text-white/45">
                  Actividad de reacciones recibida durante la transmisión.
                </p>
              </div>
            ) : null}

            {openPanel === "messages" ? (
              <div className="p-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-300">
                  Chat LIVE
                </p>
                <p className="mt-2 text-3xl font-black">
                  {messages}
                </p>
                <p className="mt-2 text-sm text-white/45">
                  Mensajes registrados en esta transmisión.
                </p>
              </div>
            ) : null}

            {openPanel === "gifts" ? (
              <div className="p-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">
                  Gifts LIVE
                </p>
                <p className="mt-2 text-3xl font-black">
                  {gifts}
                </p>
                <p className="mt-2 text-sm text-white/45">
                  Regalos registrados durante el LIVE.
                </p>
              </div>
            ) : null}

            {openPanel === "activity" ? (
              <div className="p-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                  Actividad LIVE
                </p>
                <p className="mt-2 text-3xl font-black">
                  {totalJoins}
                </p>
                <p className="mt-2 text-sm text-white/45">
                  Entradas acumuladas desde el inicio de la transmisión.
                </p>
              </div>
            ) : null}

            {openPanel === "search" ? (
              searchContent ?? (
                <div className="p-5">
                  <p className="font-bold">
                    Buscador VYRO
                  </p>
                  <p className="mt-2 text-sm text-white/45">
                    El motor de búsqueda de invitados se conectará aquí.
                  </p>
                </div>
              )
            ) : null}

            {openPanel === "guests" ? (
              guestContent ?? (
                <div className="p-5">
                  <p className="font-bold">
                    Guest Control
                  </p>
                  <p className="mt-2 text-sm text-white/45">
                    El control existente de invitados se conectará aquí.
                  </p>
                </div>
              )
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
"use client";

import {
  Camera,
  Mic,
  MonitorUp,
  Swords,
  Users,
  X,
} from "lucide-react";

import type { LiveGuestMediaHandle } from "./LiveGuestMedia";

type LiveGuestStageOverlayProps = {
  children: React.ReactNode;
  onClose?: () => void;
  guestControls?: React.RefObject<LiveGuestMediaHandle | null>;
};

export function LiveGuestStageOverlay({
  children,
  onClose,
  guestControls,
}: LiveGuestStageOverlayProps) {
  return (
    <div
      className="
        fixed
        bottom-6
        right-6
        z-[80]
        w-[min(94vw,420px)]
        overflow-hidden
        rounded-[28px]
        border
        border-cyan-400/20
        bg-[#05070A]/95
        shadow-2xl
        backdrop-blur-2xl
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-white/10
          px-4
          py-3
        "
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />

            <p className="text-xs font-black tracking-[0.18em] text-cyan-300">
              VYRO GUEST STAGE
            </p>
          </div>

          <div className="mt-1 flex items-center gap-2">
            <p className="truncate text-sm font-black text-white">
              Invitado LIVE
            </p>

            <span
              className="
                inline-flex
                items-center
                gap-1
                rounded-full
                border
                border-white/10
                bg-white/[0.05]
                px-2
                py-1
                text-[10px]
                font-black
                text-slate-300
              "
            >
              <Users size={12} />
              Stage
            </span>
          </div>
        </div>

        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            title="Salir del Guest Stage"
            className="
              rounded-full
              border
              border-white/10
              bg-white/[0.06]
              p-2
              text-white
              transition
              hover:border-red-400/30
              hover:bg-red-500/15
              hover:text-red-200
            "
          >
            <X size={18} />
          </button>
        ) : null}
      </div>

      <div className="relative bg-black">
        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            top-0
            z-10
            flex
            items-center
            justify-between
            bg-gradient-to-b
            from-black/70
            to-transparent
            px-4
            py-3
          "
        >
          <span
            className="
              rounded-full
              border
              border-emerald-400/20
              bg-emerald-400/10
              px-3
              py-1
              text-[10px]
              font-black
              uppercase
              tracking-widest
              text-emerald-300
            "
          >
            On Stage
          </span>

          <span
            className="
              rounded-full
              border
              border-white/10
              bg-black/40
              px-3
              py-1
              text-[10px]
              font-bold
              text-white/70
              backdrop-blur
            "
          >
            LIVE Guest
          </span>
        </div>

        <div className="relative aspect-video overflow-hidden bg-black">
          {children}
        </div>
      </div>

      <div
        className="
          grid
          grid-cols-4
          gap-2
          border-t
          border-white/10
          bg-black/50
          px-3
          py-3
        "
      >
        <button
          type="button"
          title="Cámara"
          onClick={() => {
            guestControls?.current?.toggleCamera();
          }}
          className="
            flex
            flex-col
            items-center
            justify-center
            gap-1
            rounded-2xl
            border
            border-white/10
            bg-white/[0.06]
            px-2
            py-3
            text-white
            transition
            hover:bg-white/10
          "
        >
          <Camera size={18} />
          <span className="text-[10px] font-bold">
            Camera
          </span>
        </button>

        <button
          type="button"
          title="Micrófono"
          onClick={() => {
            guestControls?.current?.toggleMicrophone();
          }}
          className="
            flex
            flex-col
            items-center
            justify-center
            gap-1
            rounded-2xl
            border
            border-white/10
            bg-white/[0.06]
            px-2
            py-3
            text-white
            transition
            hover:bg-white/10
          "
        >
          <Mic size={18} />
          <span className="text-[10px] font-bold">
            Mic
          </span>
        </button>

        <button
          type="button"
          title="Compartir pantalla"
          onClick={() => {
            void guestControls?.current?.toggleScreenShare();
          }}
          className="
            flex
            flex-col
            items-center
            justify-center
            gap-1
            rounded-2xl
            border
            border-white/10
            bg-white/[0.06]
            px-2
            py-3
            text-white
            transition
            hover:bg-white/10
          "
        >
          <MonitorUp size={18} />
          <span className="text-[10px] font-bold">
            Share
          </span>
        </button>

        <button
          type="button"
          title="Battle Arena"
          className="
            flex
            flex-col
            items-center
            justify-center
            gap-1
            rounded-2xl
            border
            border-cyan-300/40
            bg-cyan-400
            px-2
            py-3
            text-black
            shadow-lg
            shadow-cyan-500/10
            transition
            hover:bg-cyan-300
          "
        >
          <Swords size={18} />
          <span className="text-[10px] font-black">
            Battle
          </span>
        </button>
      </div>
    </div>
  );
}

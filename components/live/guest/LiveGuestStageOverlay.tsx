"use client";

import {
  Camera,
  Mic,
  MonitorUp,
  X,
  Swords,
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
        w-[320px]
        overflow-hidden
        rounded-3xl
        border
        border-cyan-400/20
        bg-black/80
        shadow-2xl
        backdrop-blur-xl
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
        <div>
          <p className="text-xs font-black tracking-widest text-cyan-300">
            VYRO GUEST STAGE
          </p>

          <p className="text-sm font-bold text-white">
            Invitado LIVE
          </p>
        </div>

        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="
              rounded-full
              bg-white/10
              p-2
              text-white
              transition
              hover:bg-white/20
            "
          >
            <X size={18} />
          </button>
        ) : null}
      </div>


      <div
        className="
          relative
          aspect-video
          bg-black
        "
      >
        {children}
      </div>


      <div
        className="
          flex
          items-center
          justify-around
          border-t
          border-white/10
          px-3
          py-3
        "
      >
        <button
          type="button"
          onClick={() => {
            guestControls?.current?.toggleCamera();
          }}
          className="rounded-xl bg-white/10 p-3 text-white"
        >
          <Camera size={18} />
        </button>

        <button
          type="button"
          onClick={() => {
            guestControls?.current?.toggleMicrophone();
          }}
          className="rounded-xl bg-white/10 p-3 text-white"
        >
          <Mic size={18} />
        </button>

        <button
          type="button"
          onClick={() => {
            void guestControls?.current?.toggleScreenShare();
          }}
          className="rounded-xl bg-white/10 p-3 text-white"
        >
          <MonitorUp size={18} />
        </button>

        <button
          type="button"
          className="
            rounded-xl
            bg-cyan-400
            p-3
            text-black
          "
        >
          <Swords size={18} />
        </button>
      </div>
    </div>
  );
}

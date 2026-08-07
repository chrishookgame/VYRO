"use client";

import {
  Crown,
  Sparkles,
  Trophy,
} from "lucide-react";

import ConfettiLayer from "./ConfettiLayer";
import VictoryPulse from "./VictoryPulse";

import type {
  BattleCelebrationFXState,
} from "./types";

interface BattleCelebrationFXProps {
  state: BattleCelebrationFXState;
}

export default function BattleCelebrationFX({
  state,
}: BattleCelebrationFXProps) {
  if (
    !state.visible
  ) {
    return null;
  }

  const isChampion =
    state.mode ===
    "champion";

  const Icon =
    isChampion
      ? Crown
      : Trophy;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[105] overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.14),transparent_55%)]" />

      <VictoryPulse
        intense={
          isChampion
        }
      />

      <ConfettiLayer
        intense={
          isChampion
        }
      />

      <div className="absolute inset-x-0 top-[14%] flex justify-center px-6">
        <div className="animate-pulse rounded-full border border-yellow-300/25 bg-black/55 px-6 py-3 text-center text-white shadow-[0_0_80px_rgba(250,204,21,0.22)] backdrop-blur-xl">
          <div className="flex items-center justify-center gap-2 text-yellow-200">
            <Sparkles
              size={18}
            />

            <Icon
              size={22}
            />

            <Sparkles
              size={18}
            />
          </div>

          <p className="mt-2 text-xs font-black uppercase tracking-[0.24em] text-white/50">
            {isChampion
              ? "VYRO Champion"
              : "Round Victory"}
          </p>

          {state.winnerName ? (
            <p className="mt-1 text-xl font-black text-yellow-200">
              {state.winnerName}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

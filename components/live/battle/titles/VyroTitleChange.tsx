"use client";

import {
  ArrowRight,
  Crown,
  Sparkles,
} from "lucide-react";

import type {
  VyroTitleChangeEvent,
} from "./types";

interface VyroTitleChangeProps {
  change: VyroTitleChangeEvent;
}

export default function VyroTitleChange({
  change,
}: VyroTitleChangeProps) {
  if (!change.changed) {
    return null;
  }

  const titleLabel =
    change.title === "VYRO_KING"
      ? "VYRO KING"
      : change.title === "VYRO_LEGEND"
        ? "VYRO LEGEND"
        : "VYRO ELITE";

  return (
    <article className="rounded-3xl border border-fuchsia-300/20 bg-[linear-gradient(145deg,#190A20,#090A10)] p-5">
      <div className="flex items-center gap-2 text-fuchsia-200">
        <Sparkles size={18} />

        <p className="text-xs font-black uppercase tracking-[0.18em]">
          Cambio de título
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Crown
          size={22}
          className="text-yellow-300"
        />

        <strong className="text-xl font-black text-white">
          {titleLabel}
        </strong>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 text-sm font-black">
        <span className="text-white/40">
          {change.previousHolderName ?? "Sin titular"}
        </span>

        <ArrowRight
          size={17}
          className="text-fuchsia-200"
        />

        <span className="text-fuchsia-100">
          {change.newHolderName}
        </span>
      </div>

      <p className="mt-4 text-xs font-bold text-white/35">
        {change.previousScore} → {change.newScore} pts
      </p>
    </article>
  );
}

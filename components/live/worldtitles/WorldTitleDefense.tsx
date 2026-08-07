"use client";

import {
  ShieldCheck,
  ShieldX,
  Swords,
} from "lucide-react";

import type {
  WorldTitleDefenseEvent,
} from "./types";

interface WorldTitleDefenseProps {
  defense: WorldTitleDefenseEvent | null;
}

export default function WorldTitleDefense({
  defense,
}: WorldTitleDefenseProps) {
  if (!defense) {
    return null;
  }

  const Icon =
    defense.successful
      ? ShieldCheck
      : ShieldX;

  return (
    <section className="rounded-[2rem] border border-cyan-300/15 bg-[#071018] p-5">
      <div className="flex items-center gap-2 text-cyan-200">
        <Swords size={19} />

        <p className="text-xs font-black uppercase tracking-[0.18em]">
          World Title Defense
        </p>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <Icon
          size={28}
          className={
            defense.successful
              ? "text-emerald-200"
              : "text-red-300"
          }
        />

        <div>
          <h3 className="text-2xl font-black text-white">
            {defense.successful
              ? `${defense.holderName} defendió la corona`
              : `${defense.challengerName} destronó al campeón`}
          </h3>

          <p className="mt-1 text-sm font-bold text-white/45">
            Defensa #{defense.defenseNumber}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-xs text-white/35">
            Champion
          </p>

          <p className="mt-1 font-black text-white">
            {defense.holderName} — {defense.holderScore}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-xs text-white/35">
            Challenger
          </p>

          <p className="mt-1 font-black text-white">
            {defense.challengerName} — {defense.challengerScore}
          </p>
        </div>
      </div>
    </section>
  );
}

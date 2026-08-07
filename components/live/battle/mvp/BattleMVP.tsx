"use client";

import {
  BrainCircuit,
  Crown,
} from "lucide-react";

import BattleMVPScore from "./BattleMVPScore";

import type {
  BattleMVPResult,
} from "./types";

interface BattleMVPProps {
  result: BattleMVPResult;
}

export default function BattleMVP({
  result,
}: BattleMVPProps) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-yellow-300/15 bg-[#0D0D12]">
      <header className="border-b border-white/10 px-6 py-5">
        <div className="flex items-center gap-2 text-yellow-200">
          <BrainCircuit size={20} />

          <p className="text-xs font-black uppercase tracking-[0.24em]">
            VYRO AI MVP Detection
          </p>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Crown
            size={28}
            className="text-yellow-300"
          />

          <h2 className="text-2xl font-black text-white">
            {result.winner
              ? `${result.winner.creatorName} es el MVP`
              : "MVP en análisis"}
          </h2>
        </div>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-white/50">
          {result.reason}
        </p>

        <p className="mt-3 text-xs font-black uppercase tracking-[0.16em] text-white/35">
          Confianza: {result.confidence}%
        </p>
      </header>

      <div className="grid gap-4 p-5 lg:grid-cols-2">
        {result.left ? (
          <BattleMVPScore
            score={result.left}
            winner={
              result.winner?.creatorId ===
              result.left.creatorId
            }
          />
        ) : null}

        {result.right ? (
          <BattleMVPScore
            score={result.right}
            winner={
              result.winner?.creatorId ===
              result.right.creatorId
            }
          />
        ) : null}
      </div>
    </section>
  );
}

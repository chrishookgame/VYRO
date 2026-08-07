"use client";

import {
  Star,
} from "lucide-react";

interface BattleMVPCardProps {
  mvpName: string;
}

export default function BattleMVPCard({
  mvpName,
}: BattleMVPCardProps) {
  return (
    <article className="rounded-[2rem] border border-fuchsia-300/20 bg-[linear-gradient(145deg,#190B1E,#090A10)] p-6">
      <Star
        size={28}
        className="text-fuchsia-200"
      />

      <p className="mt-4 text-xs font-black uppercase tracking-[0.22em] text-fuchsia-200/60">
        Battle MVP
      </p>

      <h3 className="mt-2 text-3xl font-black text-white">
        {mvpName}
      </h3>
    </article>
  );
}

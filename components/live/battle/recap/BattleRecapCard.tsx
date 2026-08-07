"use client";

interface BattleRecapCardProps {
  label: string;
  value: string;
}

export default function BattleRecapCard({
  label,
  value,
}: BattleRecapCardProps) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-white/40">
        {label}
      </p>

      <p className="mt-3 break-words text-xl font-black text-white">
        {value}
      </p>
    </article>
  );
}

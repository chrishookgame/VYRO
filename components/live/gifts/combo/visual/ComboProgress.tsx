"use client";

interface ComboProgressProps {
  progress: number;
  nextTierAt: number | null;
  count: number;
}

export default function ComboProgress({
  progress,
  nextTierAt,
  count,
}: ComboProgressProps) {
  const safeProgress = Math.min(
    Math.max(progress, 0),
    1,
  );

  const percentage = Math.round(
    safeProgress * 100,
  );

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-black/25 p-4 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 text-xs font-bold text-white/70">
        <span>
          Progreso del combo
        </span>

        <span>
          {nextTierAt
            ? `${count}/${nextTierAt}`
            : "Nivel máximo"}
        </span>
      </div>

      <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-violet-400 to-fuchsia-400 transition-[width] duration-300"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

      <p className="mt-2 text-right text-[11px] font-black uppercase tracking-[0.18em] text-white/50">
        {nextTierAt
          ? `${percentage}% hacia el próximo nivel`
          : "Combo Mythic alcanzado"}
      </p>
    </div>
  );
}

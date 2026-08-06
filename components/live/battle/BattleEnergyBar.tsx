"use client";

interface BattleEnergyBarProps {
  leftValue: number;
  rightValue: number;
  leftLabel?: string;
  rightLabel?: string;
}

function normalizeValue(
  value: number,
): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, value);
}

export default function BattleEnergyBar({
  leftValue,
  rightValue,
  leftLabel = "Lado izquierdo",
  rightLabel = "Lado derecho",
}: BattleEnergyBarProps) {
  const safeLeft =
    normalizeValue(leftValue);

  const safeRight =
    normalizeValue(rightValue);

  const total =
    safeLeft + safeRight;

  const leftPercent =
    total > 0
      ? Math.round(
          (safeLeft / total) * 100,
        )
      : 50;

  const rightPercent =
    100 - leftPercent;

  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
      <div className="flex items-center justify-between gap-4 text-xs font-black uppercase tracking-[0.16em]">
        <span className="truncate text-cyan-300">
          {leftLabel}
        </span>

        <span className="truncate text-right text-fuchsia-300">
          {rightLabel}
        </span>
      </div>

      <div className="mt-4 overflow-hidden rounded-full border border-white/10 bg-white/[0.05]">
        <div className="flex h-6">
          <div
            className="flex items-center justify-start bg-cyan-400 px-2 text-[10px] font-black text-black transition-[width] duration-500"
            style={{
              width: `${leftPercent}%`,
            }}
          >
            {leftPercent >= 12
              ? `${leftPercent}%`
              : null}
          </div>

          <div
            className="flex items-center justify-end bg-fuchsia-400 px-2 text-[10px] font-black text-black transition-[width] duration-500"
            style={{
              width: `${rightPercent}%`,
            }}
          >
            {rightPercent >= 12
              ? `${rightPercent}%`
              : null}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-white/40">
            Energía
          </p>

          <p className="mt-1 font-black text-cyan-200">
            {safeLeft.toLocaleString(
              "es-419",
            )}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-white/40">
            Energía
          </p>

          <p className="mt-1 font-black text-fuchsia-200">
            {safeRight.toLocaleString(
              "es-419",
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

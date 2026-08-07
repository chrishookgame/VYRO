"use client";

interface PredictionMeterProps {
  championProbability: number;
  challengerProbability: number;
}

export default function PredictionMeter({
  championProbability,
  challengerProbability,
}: PredictionMeterProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
      <div className="flex items-center justify-between gap-4 text-xs font-black uppercase tracking-[0.16em] text-white/40">
        <span>
          Champion {championProbability}%
        </span>

        <span>
          Challenger {challengerProbability}%
        </span>
      </div>

      <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-white/10">
        <div
          className="bg-yellow-300"
          style={{
            width:
              `${championProbability}%`,
          }}
        />

        <div
          className="bg-fuchsia-400"
          style={{
            width:
              `${challengerProbability}%`,
          }}
        />
      </div>
    </div>
  );
}

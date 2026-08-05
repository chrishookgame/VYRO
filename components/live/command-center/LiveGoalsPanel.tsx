import {
  Target,
  Trophy,
} from "lucide-react";

interface LiveGoalsPanelProps {
  current: number;
  target: number;
  label?: string;
}

export default function LiveGoalsPanel({
  current,
  target,
  label = "Meta de audiencia",
}: LiveGoalsPanelProps) {
  const progress =
    target > 0
      ? Math.min(
          100,
          Math.round(
            (current / target) * 100,
          ),
        )
      : 0;

  return (
    <section className="rounded-3xl border border-cyan-400/15 bg-white/[0.035] p-5 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
            Objetivo LIVE
          </p>

          <h3 className="mt-2 text-xl font-black text-white">
            {label}
          </h3>
        </div>

        <Target className="text-cyan-300" />
      </div>

      <div className="mt-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-3xl font-black text-white">
              {current}
              <span className="text-lg text-gray-500">
                {" "}
                / {target}
              </span>
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-sm font-black text-cyan-200">
            <Trophy size={16} />
            {progress}%
          </div>
        </div>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-black/30">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>
    </section>
  );
}

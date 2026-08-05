import {
  Bot,
  Lightbulb,
  Sparkles,
} from "lucide-react";

interface LiveAiPanelProps {
  recommendation?: string;
}

export default function LiveAiPanel({
  recommendation =
    "Mantén el ritmo de interacción: la audiencia está respondiendo mejor a los momentos participativos.",
}: LiveAiPanelProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 via-white/[0.035] to-blue-500/10 p-5">
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-300/10 blur-3xl" />

      <div className="relative">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
              VYRO AI
            </p>

            <h3 className="mt-2 text-xl font-black text-white">
              Director inteligente
            </h3>
          </div>

          <Bot className="text-cyan-300" />
        </div>

        <div className="mt-6 rounded-2xl border border-cyan-300/15 bg-black/20 p-5">
          <div className="flex items-center gap-2 text-cyan-200">
            <Lightbulb size={18} />
            <span className="text-sm font-black">
              Recomendación actual
            </span>
          </div>

          <p className="mt-3 leading-7 text-gray-300">
            {recommendation}
          </p>
        </div>

        <div className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-cyan-300">
          <Sparkles size={15} />
          Analizando el LIVE en tiempo real
        </div>
      </div>
    </section>
  );
}

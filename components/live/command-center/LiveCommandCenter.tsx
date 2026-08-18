import {
  Activity,
  Radio,
  Sparkles,
} from "lucide-react";

import LiveAiPanel from "./LiveAiPanel";
import LiveAudiencePanel from "./LiveAudiencePanel";
import LiveGoalsPanel from "./LiveGoalsPanel";
import LiveHealthPanel from "./LiveHealthPanel";
import LiveRevenuePanel from "./LiveRevenuePanel";
import LiveStatsPanel from "./LiveStatsPanel";
import LiveTrendPanel from "./LiveTrendPanel";

interface LiveCommandCenterProps {
  activeViewers?: number;
  peakViewers?: number;
  totalJoins?: number;
  reactions?: number;
  gifts?: number;
  grossRevenue?: number;
  energy?: number;
  messages?: number;
  connected?: boolean;
}

export default function LiveCommandCenter({
  activeViewers = 0,
  peakViewers = 0,
  totalJoins = 0,
  reactions = 0,
  gifts = 0,
  grossRevenue = 0,
  energy = 0,
  messages = 0,
  connected = false,
}: LiveCommandCenterProps) {
  return (
    <section className="relative overflow-hidden rounded-[2.25rem] border border-cyan-400/20 bg-[#04101A] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.35)] md:p-8">
      <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-blue-600/10 blur-3xl" />

      <div className="relative">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <div className="flex items-center gap-3 text-cyan-300">
              <Radio size={22} />
              <p className="text-xs font-black uppercase tracking-[0.28em]">
                VYRO LIVE COMMAND CENTER
              </p>
            </div>

            <h2 className="mt-4 text-3xl font-black text-white md:text-4xl">
              Control total de la experiencia LIVE
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-gray-400">
              Audiencia, interacción, monetización, salud técnica y VYRO AI
              reunidos en una sola cabina de control.
            </p>
          </div>

          <div
            className={`inline-flex items-center gap-3 rounded-full border px-4 py-3 text-sm font-black ${
              connected
                ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-300"
                : "border-yellow-400/30 bg-yellow-500/10 text-yellow-300"
            }`}
          >
            <Activity size={18} />
            {connected
              ? "Realtime conectado"
              : "Esperando conexión"}
          </div>
        </div>

        <div className="mt-8 grid gap-5 xl:grid-cols-2">
          <LiveAudiencePanel
            activeViewers={activeViewers}
            peakViewers={peakViewers}
            totalJoins={totalJoins}
          />

          <LiveStatsPanel
            reactions={reactions}
            gifts={gifts}
            energy={energy}
            messages={messages}
          />

          <LiveAiPanel />

          <LiveGoalsPanel
            current={activeViewers}
            target={Math.max(100, peakViewers * 2)}
          />

          <LiveHealthPanel
            connected={connected}
            latency={42}
            fps={60}
            bitrate={6500}
          />

          <LiveRevenuePanel
            gifts={gifts}
            grossRevenue={grossRevenue}
            creatorRevenue={0}
            pendingRevenue={0}
          />

          <div className="xl:col-span-2">
            <LiveTrendPanel
              growthPercent={0}
              rankPosition={1}
              momentum="stable"
            />
          </div>
        </div>

        <div className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-cyan-300">
          <Sparkles size={15} />
          Command Center preparado para datos Realtime y VYRO AI
        </div>
      </div>
    </section>
  );
}

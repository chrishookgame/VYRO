"use client";

export type LiveBattleStatus =
  | "waiting"
  | "active"
  | "finished";

export interface LiveBattleSide {
  creatorId: string;
  creatorName: string;
  score: number;
  giftCount: number;
  energy: number;
}

export interface LiveBattleState {
  id: string;
  roomId: string;
  status: LiveBattleStatus;
  startedAt: string | null;
  endsAt: string | null;
  left: LiveBattleSide;
  right: LiveBattleSide;
  winnerId: string | null;
}

interface LiveBattleEngineProps {
  battle: LiveBattleState;
}

function getWinnerLabel(
  battle: LiveBattleState,
): string {
  if (battle.status !== "finished") {
    return "Batalla en progreso";
  }

  if (!battle.winnerId) {
    return "Empate";
  }

  if (
    battle.winnerId ===
    battle.left.creatorId
  ) {
    return `${battle.left.creatorName} ganó`;
  }

  return `${battle.right.creatorName} ganó`;
}

export default function LiveBattleEngine({
  battle,
}: LiveBattleEngineProps) {
  const totalScore =
    battle.left.score +
    battle.right.score;

  const leftPercent =
    totalScore > 0
      ? Math.round(
          (battle.left.score /
            totalScore) *
            100,
        )
      : 50;

  const rightPercent =
    100 - leftPercent;

  return (
    <section className="rounded-[2rem] border border-fuchsia-400/20 bg-[#07111D] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-fuchsia-300">
            VYRO LIVE BATTLE
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">
            Duelo de creadores
          </h2>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-right">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
            Estado
          </p>

          <p className="mt-1 text-sm font-black text-white">
            {battle.status}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <article className="rounded-3xl border border-cyan-400/20 bg-cyan-400/[0.06] p-5">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
            Lado izquierdo
          </p>

          <h3 className="mt-3 text-xl font-black text-white">
            {battle.left.creatorName}
          </h3>

          <p className="mt-4 text-3xl font-black text-cyan-200">
            {battle.left.score.toLocaleString(
              "es-419",
            )}
          </p>

          <p className="mt-2 text-sm text-white/45">
            {battle.left.giftCount.toLocaleString(
              "es-419",
            )}{" "}
            regalos ·{" "}
            {battle.left.energy.toLocaleString(
              "es-419",
            )}{" "}
            energía
          </p>
        </article>

        <article className="rounded-3xl border border-fuchsia-400/20 bg-fuchsia-400/[0.06] p-5">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-fuchsia-300">
            Lado derecho
          </p>

          <h3 className="mt-3 text-xl font-black text-white">
            {battle.right.creatorName}
          </h3>

          <p className="mt-4 text-3xl font-black text-fuchsia-200">
            {battle.right.score.toLocaleString(
              "es-419",
            )}
          </p>

          <p className="mt-2 text-sm text-white/45">
            {battle.right.giftCount.toLocaleString(
              "es-419",
            )}{" "}
            regalos ·{" "}
            {battle.right.energy.toLocaleString(
              "es-419",
            )}{" "}
            energía
          </p>
        </article>
      </div>

      <div className="mt-6 overflow-hidden rounded-full border border-white/10 bg-white/[0.05]">
        <div className="flex h-5">
          <div
            className="bg-cyan-400"
            style={{
              width: `${leftPercent}%`,
            }}
          />

          <div
            className="bg-fuchsia-400"
            style={{
              width: `${rightPercent}%`,
            }}
          />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs font-black text-white/50">
        <span>{leftPercent}%</span>
        <span>{rightPercent}%</span>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-center">
        <p className="text-sm font-black text-white">
          {getWinnerLabel(battle)}
        </p>
      </div>
    </section>
  );
}

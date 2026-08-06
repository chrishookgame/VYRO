export type BattleCountdownPhase =
  | "idle"
  | "scheduled"
  | "intermission"
  | "active"
  | "finished";

export interface BattleCountdownSnapshot {
  phase: BattleCountdownPhase;
  targetAt: string | null;
  remainingMilliseconds: number;
  remainingSeconds: number;
  expired: boolean;
  label: string;
}

export interface CreateBattleCountdownInput {
  phase: BattleCountdownPhase;
  targetAt: string | null;
  now?: Date;
}

function formatCountdownLabel(
  remainingSeconds: number,
): string {
  const safeSeconds = Math.max(
    0,
    Math.floor(remainingSeconds),
  );

  const minutes = Math.floor(
    safeSeconds / 60,
  );

  const seconds = safeSeconds % 60;

  return `${minutes
    .toString()
    .padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

export class BattleCountdownManager {
  createSnapshot({
    phase,
    targetAt,
    now = new Date(),
  }: CreateBattleCountdownInput):
    BattleCountdownSnapshot {
    if (
      phase === "idle" ||
      phase === "finished" ||
      !targetAt
    ) {
      return {
        phase,
        targetAt,
        remainingMilliseconds: 0,
        remainingSeconds: 0,
        expired:
          phase === "finished",
        label: "00:00",
      };
    }

    const targetTime =
      new Date(targetAt).getTime();

    if (!Number.isFinite(targetTime)) {
      return {
        phase,
        targetAt,
        remainingMilliseconds: 0,
        remainingSeconds: 0,
        expired: true,
        label: "00:00",
      };
    }

    const remainingMilliseconds =
      Math.max(
        0,
        targetTime - now.getTime(),
      );

    const remainingSeconds =
      Math.ceil(
        remainingMilliseconds / 1000,
      );

    return {
      phase,
      targetAt,
      remainingMilliseconds,
      remainingSeconds,
      expired:
        remainingMilliseconds === 0,
      label:
        formatCountdownLabel(
          remainingSeconds,
        ),
    };
  }

  isReady(
    snapshot: BattleCountdownSnapshot,
  ): boolean {
    return (
      snapshot.expired &&
      (
        snapshot.phase ===
          "scheduled" ||
        snapshot.phase ===
          "intermission"
      )
    );
  }
}

export const battleCountdownManager =
  new BattleCountdownManager();

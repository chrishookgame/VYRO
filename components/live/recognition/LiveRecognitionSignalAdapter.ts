import type {
  LiveRecognitionContext,
  LiveRecognitionSignal,
} from "./types";

export interface LiveRecognitionRuntimeInput {
  creatorId: string;
  creatorName: string;

  levelUp?: boolean;
  level?: number;

  winStreak?: number;

  battleWinner?: boolean;
  champion?: boolean;

  milestone?: string | null;
  spotlight?: boolean;

  hypeScore?: number;
  competitiveIntensity?: number;

  occurredAt?: number;
}

export interface LiveRecognitionSignalBundle {
  signals: LiveRecognitionSignal[];
  context: LiveRecognitionContext;
}

export function createLiveRecognitionSignals(
  input: LiveRecognitionRuntimeInput,
): LiveRecognitionSignalBundle {
  const signals: LiveRecognitionSignal[] = [];

  const occurredAt =
    input.occurredAt ??
    Date.now();

  if (input.levelUp) {
    signals.push({
      kind: "LEVEL_UP",
      creatorId: input.creatorId,
      creatorName: input.creatorName,
      value: input.level,
      label:
        typeof input.level === "number"
          ? `${input.creatorName} alcanzo el nivel ${input.level}.`
          : undefined,
      occurredAt,
    });
  }

  if (
    typeof input.winStreak === "number" &&
    input.winStreak > 1
  ) {
    signals.push({
      kind: "WIN_STREAK",
      creatorId: input.creatorId,
      creatorName: input.creatorName,
      value: input.winStreak,
      occurredAt,
    });
  }

  if (input.battleWinner) {
    signals.push({
      kind: "BATTLE_WINNER",
      creatorId: input.creatorId,
      creatorName: input.creatorName,
      occurredAt,
    });
  }

  if (input.champion) {
    signals.push({
      kind: "CHAMPION",
      creatorId: input.creatorId,
      creatorName: input.creatorName,
      occurredAt,
    });
  }

  if (input.milestone) {
    signals.push({
      kind: "MILESTONE",
      creatorId: input.creatorId,
      creatorName: input.creatorName,
      label: input.milestone,
      occurredAt,
    });
  }

  if (input.spotlight) {
    signals.push({
      kind: "SPOTLIGHT",
      creatorId: input.creatorId,
      creatorName: input.creatorName,
      occurredAt,
    });
  }

  if (
    typeof input.hypeScore === "number" &&
    input.hypeScore >= 65
  ) {
    signals.push({
      kind: "HYPE",
      creatorId: input.creatorId,
      creatorName: input.creatorName,
      value: input.hypeScore,
      occurredAt,
    });
  }

  return {
    signals,
    context: {
      now: occurredAt,
      hypeScore: input.hypeScore,
      competitiveIntensity:
        input.competitiveIntensity,
    },
  };
}

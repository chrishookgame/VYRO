import type {
  LiveRecognitionContext,
  LiveRecognitionIntensity,
  LiveRecognitionMoment,
  LiveRecognitionSignal,
} from "./types";

const PRIORITY: Record<LiveRecognitionSignal["kind"], number> = {
  LEVEL_UP: 70,
  WIN_STREAK: 80,
  BATTLE_WINNER: 90,
  CHAMPION: 100,
  MILESTONE: 75,
  SPOTLIGHT: 65,
  HYPE: 50,
};

const DURATION: Record<LiveRecognitionIntensity, number> = {
  standard: 4_000,
  epic: 5_500,
  legendary: 7_000,
};

function normalizeIntensity(
  signal: LiveRecognitionSignal,
  context: LiveRecognitionContext,
): LiveRecognitionIntensity {
  if (signal.intensity) {
    return signal.intensity;
  }

  const hypeScore = context.hypeScore ?? 0;
  const competitiveIntensity = context.competitiveIntensity ?? 0;

  if (
    signal.kind === "CHAMPION" ||
    signal.kind === "BATTLE_WINNER" ||
    hypeScore >= 90 ||
    competitiveIntensity >= 90
  ) {
    return "legendary";
  }

  if (
    signal.kind === "WIN_STREAK" ||
    signal.kind === "LEVEL_UP" ||
    signal.kind === "MILESTONE" ||
    hypeScore >= 65 ||
    competitiveIntensity >= 65
  ) {
    return "epic";
  }

  return "standard";
}

function resolveCopy(
  signal: LiveRecognitionSignal,
): Pick<LiveRecognitionMoment, "title" | "message"> {
  switch (signal.kind) {
    case "LEVEL_UP":
      return {
        title: "LEVEL UP",
        message:
          signal.label ??
          `${signal.creatorName} alcanzo un nuevo nivel en VYRO.`,
      };

    case "WIN_STREAK":
      return {
        title: "WIN STREAK",
        message:
          signal.label ??
          `${signal.creatorName} lleva ${signal.value ?? 0} victorias consecutivas.`,
      };

    case "BATTLE_WINNER":
      return {
        title: "BATTLE WINNER",
        message:
          signal.label ??
          `${signal.creatorName} acaba de ganar la batalla.`,
      };

    case "CHAMPION":
      return {
        title: "VYRO CHAMPION",
        message:
          signal.label ??
          `${signal.creatorName} entra en un momento de campeon.`,
      };

    case "MILESTONE":
      return {
        title: "MILESTONE",
        message:
          signal.label ??
          `${signal.creatorName} acaba de alcanzar un nuevo hito.`,
      };

    case "SPOTLIGHT":
      return {
        title: "CREATOR SPOTLIGHT",
        message:
          signal.label ??
          `${signal.creatorName} esta dominando el momento LIVE.`,
      };

    case "HYPE":
      return {
        title: "VYRO HYPE",
        message:
          signal.label ??
          `${signal.creatorName} esta elevando la energia del LIVE.`,
      };
  }
}

export function createLiveRecognitionMoment(
  signal: LiveRecognitionSignal,
  context: LiveRecognitionContext = {},
): LiveRecognitionMoment {
  const occurredAt =
    signal.occurredAt ??
    context.now ??
    Date.now();

  const intensity = normalizeIntensity(signal, context);
  const copy = resolveCopy(signal);

  return {
    id: [
      signal.kind,
      signal.creatorId,
      occurredAt,
    ].join(":"),
    kind: signal.kind,
    creatorId: signal.creatorId,
    creatorName: signal.creatorName,
    title: copy.title,
    message: copy.message,
    intensity,
    priority: PRIORITY[signal.kind],
    durationMs: DURATION[intensity],
    occurredAt,
  };
}

export function rankLiveRecognitionMoments(
  moments: LiveRecognitionMoment[],
): LiveRecognitionMoment[] {
  return [...moments].sort((left, right) => {
    if (right.priority !== left.priority) {
      return right.priority - left.priority;
    }

    return right.occurredAt - left.occurredAt;
  });
}

export function resolvePrimaryLiveRecognitionMoment(
  moments: LiveRecognitionMoment[],
): LiveRecognitionMoment | null {
  return rankLiveRecognitionMoments(moments)[0] ?? null;
}

import type {
  PresentationEvent,
  PresentationEventType,
} from "../types/PresentationEvent";

export interface PresentationCooldownConfig {
  typeCooldownMs: number;
  creatorCooldownMs: number;
}

export interface PresentationCooldownMemory {
  typeLastShown:
    Partial<
      Record<
        PresentationEventType,
        number
      >
    >;

  creatorLastShown:
    Record<
      string,
      number
    >;
}

export const DEFAULT_PRESENTATION_COOLDOWN:
PresentationCooldownConfig = {
  typeCooldownMs: 8000,
  creatorCooldownMs: 6000,
};

function normalizeTimestamp(
  value: number,
): number {
  return Number.isFinite(value)
    ? Math.max(0, value)
    : 0;
}

function normalizeCooldownMs(
  value: number,
): number {
  return Number.isFinite(value)
    ? Math.max(
        0,
        Math.round(value),
      )
    : 0;
}

function hasCooldownElapsed(
  lastShown: number | undefined,
  now: number,
  cooldownMs: number,
): boolean {
  if (
    typeof lastShown !== "number" ||
    !Number.isFinite(lastShown)
  ) {
    return true;
  }

  const safeNow =
    normalizeTimestamp(now);

  const safeLastShown =
    normalizeTimestamp(lastShown);

  const safeCooldown =
    normalizeCooldownMs(
      cooldownMs,
    );

  return (
    safeNow - safeLastShown >=
    safeCooldown
  );
}

export function createPresentationCooldownMemory():
PresentationCooldownMemory {
  return {
    typeLastShown: {},
    creatorLastShown: {},
  };
}

export function isPresentationEventOnCooldown(
  event: PresentationEvent,
  memory: PresentationCooldownMemory,
  now: number,
  config:
    PresentationCooldownConfig =
      DEFAULT_PRESENTATION_COOLDOWN,
): boolean {
  const typeLastShown =
    memory.typeLastShown[
      event.type
    ];

  if (
    !hasCooldownElapsed(
      typeLastShown,
      now,
      config.typeCooldownMs,
    )
  ) {
    return true;
  }

  if (event.creatorId) {
    const creatorLastShown =
      memory.creatorLastShown[
        event.creatorId
      ];

    if (
      !hasCooldownElapsed(
        creatorLastShown,
        now,
        config.creatorCooldownMs,
      )
    ) {
      return true;
    }
  }

  return false;
}

export function rememberPresentationEvent(
  event: PresentationEvent,
  memory: PresentationCooldownMemory,
  now: number,
): PresentationCooldownMemory {
  const safeNow =
    normalizeTimestamp(now);

  return {
    typeLastShown: {
      ...memory.typeLastShown,

      [event.type]:
        safeNow,
    },

    creatorLastShown:
      event.creatorId
        ? {
            ...memory.creatorLastShown,

            [event.creatorId]:
              safeNow,
          }
        : memory.creatorLastShown,
  };
}

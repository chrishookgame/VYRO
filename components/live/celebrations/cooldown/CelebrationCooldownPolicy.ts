import type {
  VyroCelebrationIntensity,
  VyroCelebrationType,
  VyroLiveCelebrationEvent,
} from "../types";

export interface CelebrationCooldownConfig {
  creatorCooldownMs: number;
  typeCooldownMs: number;
}

export interface CelebrationCooldownMemory {
  creatorLastShown: Map<string, number>;
  typeLastShown: Map<VyroCelebrationType, number>;
}

export const DEFAULT_CELEBRATION_COOLDOWN:
  CelebrationCooldownConfig = {
    creatorCooldownMs: 4000,
    typeCooldownMs: 2500,
  };

export function createCelebrationCooldownMemory():
  CelebrationCooldownMemory {
  return {
    creatorLastShown: new Map(),
    typeLastShown: new Map(),
  };
}

function normalizeTimestamp(
  value: number,
): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(
    0,
    value,
  );
}

function normalizeCooldown(
  value: number,
): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(
    0,
    value,
  );
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
    normalizeCooldown(cooldownMs);

  return (
    safeNow - safeLastShown >=
    safeCooldown
  );
}

export function bypassCelebrationCooldown(
  intensity: VyroCelebrationIntensity,
): boolean {
  return intensity === "legendary";
}

export function isCelebrationOnCooldown(
  event: VyroLiveCelebrationEvent,
  memory: CelebrationCooldownMemory,
  now: number,
  config:
    CelebrationCooldownConfig =
      DEFAULT_CELEBRATION_COOLDOWN,
): boolean {
  if (
    bypassCelebrationCooldown(
      event.intensity,
    )
  ) {
    return false;
  }

  const creatorLastShown =
    memory.creatorLastShown.get(
      event.creatorId,
    );

  if (
    !hasCooldownElapsed(
      creatorLastShown,
      now,
      config.creatorCooldownMs,
    )
  ) {
    return true;
  }

  const typeLastShown =
    memory.typeLastShown.get(
      event.type,
    );

  return !hasCooldownElapsed(
    typeLastShown,
    now,
    config.typeCooldownMs,
  );
}

export function markCelebrationShown(
  event: VyroLiveCelebrationEvent,
  memory: CelebrationCooldownMemory,
  now: number,
): void {
  const timestamp =
    normalizeTimestamp(now);

  memory.creatorLastShown.set(
    event.creatorId,
    timestamp,
  );

  memory.typeLastShown.set(
    event.type,
    timestamp,
  );
}
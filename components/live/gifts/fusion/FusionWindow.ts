import type {
  FusedEvent,
  FusionConfiguration,
} from "./types";

export const defaultFusionConfiguration: FusionConfiguration = {
  windowMs: 4000,
  maximumEvents: 250,
};

export function createFusionExpiration(
  currentTime = Date.now(),
  windowMs =
    defaultFusionConfiguration.windowMs,
): number {
  return (
    currentTime +
    Math.max(windowMs, 0)
  );
}

export function getFusionRemainingTime(
  fusedEvent: FusedEvent,
  currentTime = Date.now(),
): number {
  return Math.max(
    fusedEvent.expiresAt -
      currentTime,
    0,
  );
}

export function isFusedEventExpired(
  fusedEvent: FusedEvent,
  currentTime = Date.now(),
): boolean {
  return (
    getFusionRemainingTime(
      fusedEvent,
      currentTime,
    ) === 0
  );
}

export function refreshFusedEventExpiration(
  fusedEvent: FusedEvent,
  currentTime = Date.now(),
  windowMs =
    defaultFusionConfiguration.windowMs,
): FusedEvent {
  return {
    ...fusedEvent,
    updatedAt: currentTime,
    expiresAt:
      createFusionExpiration(
        currentTime,
        windowMs,
      ),
  };
}

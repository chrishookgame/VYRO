import type {
  PresentationEventType,
} from "../types/PresentationEvent";

interface PresentationPriorityBand {
  base: number;
  max: number;
}

/*
 * Competitive presentation hierarchy.
 *
 * Every presentation type owns a protected
 * priority band.
 *
 * Adaptive AI priority boosts may move an event
 * inside its own band, but can never promote a
 * lower-tier event above a higher competitive
 * achievement.
 *
 * This guarantees, for example, that a BANNER
 * can never outrank a WORLD_CHAMPION.
 */
const PRESENTATION_PRIORITY_BANDS: Record<
  PresentationEventType,
  PresentationPriorityBand
> = {
  WORLD_CHAMPION: {
    base: 700,
    max: 799,
  },

  CHAMPION: {
    base: 600,
    max: 699,
  },

  MVP: {
    base: 500,
    max: 599,
  },

  TOP_RANK: {
    base: 400,
    max: 499,
  },

  WIN_STREAK: {
    base: 300,
    max: 399,
  },

  SPOTLIGHT: {
    base: 200,
    max: 299,
  },

  BANNER: {
    base: 100,
    max: 199,
  },
};

export function getPresentationPriority(
  type: PresentationEventType,
): number {
  return PRESENTATION_PRIORITY_BANDS[type].base;
}

export function getPresentationMaxPriority(
  type: PresentationEventType,
): number {
  return PRESENTATION_PRIORITY_BANDS[type].max;
}

export function resolvePresentationPriority(
  type: PresentationEventType,
  priorityBoost = 0,
): number {
  const band =
    PRESENTATION_PRIORITY_BANDS[type];

  const normalizedBoost =
    Number.isFinite(priorityBoost)
      ? Math.max(
          0,
          Math.round(priorityBoost),
        )
      : 0;

  return Math.min(
    band.max,
    band.base + normalizedBoost,
  );
}

export function comparePresentationPriority(
  a: PresentationEventType,
  b: PresentationEventType,
): number {
  return (
    getPresentationPriority(b) -
    getPresentationPriority(a)
  );
}

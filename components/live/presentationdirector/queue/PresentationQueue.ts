import {
  resolvePresentationPriority,
} from "../priority/PresentationPriority";

import type {
  PresentationEvent,
  ScheduledPresentationEvent,
} from "../types/PresentationEvent";

const DEFAULT_DURATION_MS = 4000;

const MIN_DURATION_MS = 1000;

const MIN_PRIORITY_BOOST = 0;

const MAX_PRIORITY_BOOST = 100;

function normalizeFiniteNumber(
  value: number | undefined,
  fallback: number,
): number {
  return typeof value === "number" &&
    Number.isFinite(value)
    ? value
    : fallback;
}

function normalizePriorityBoost(
  priorityBoost: number | undefined,
): number {
  const normalized =
    normalizeFiniteNumber(
      priorityBoost,
      MIN_PRIORITY_BOOST,
    );

  return Math.max(
    MIN_PRIORITY_BOOST,
    Math.min(
      MAX_PRIORITY_BOOST,
      Math.round(normalized),
    ),
  );
}

function normalizeDuration(
  durationMs: number | undefined,
): number {
  const normalized =
    normalizeFiniteNumber(
      durationMs,
      DEFAULT_DURATION_MS,
    );

  return Math.max(
    MIN_DURATION_MS,
    Math.round(normalized),
  );
}

export function normalizePresentationEvent(
  event: PresentationEvent,
): ScheduledPresentationEvent {
  const priorityBoost =
    normalizePriorityBoost(
      event.priorityBoost,
    );

  return {
    ...event,

    priority:
      resolvePresentationPriority(
        event.type,
        priorityBoost,
      ),

    durationMs:
      normalizeDuration(
        event.durationMs,
      ),
  };
}

function comparePresentationEvents(
  a: ScheduledPresentationEvent,
  b: ScheduledPresentationEvent,
): number {
  if (
    b.priority !==
    a.priority
  ) {
    return (
      b.priority -
      a.priority
    );
  }

  if (
    a.createdAt !==
    b.createdAt
  ) {
    return (
      a.createdAt -
      b.createdAt
    );
  }

  return a.id.localeCompare(
    b.id,
  );
}

export function createPresentationQueue(
  events: PresentationEvent[],
): ScheduledPresentationEvent[] {
  return events
    .map(
      normalizePresentationEvent,
    )
    .sort(
      comparePresentationEvents,
    );
}

export function deduplicatePresentationQueue(
  events: ScheduledPresentationEvent[],
): ScheduledPresentationEvent[] {
  const ids =
    new Set<string>();

  return events.filter(
    event => {
      if (
        ids.has(event.id)
      ) {
        return false;
      }

      ids.add(event.id);

      return true;
    },
  );
}

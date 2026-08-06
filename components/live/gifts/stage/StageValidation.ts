import type {
  StageEvent,
} from "./types";

export interface StageEventValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateStageEvent(
  event: StageEvent,
): StageEventValidationResult {
  const errors: string[] = [];

  if (!event.id.trim()) {
    errors.push(
      "El evento de escenario necesita un id.",
    );
  }

  if (
    !Number.isFinite(
      event.createdAt,
    ) ||
    event.createdAt < 0
  ) {
    errors.push(
      "createdAt debe ser un número válido.",
    );
  }

  if (
    !Number.isFinite(
      event.durationMs,
    ) ||
    event.durationMs < 0
  ) {
    errors.push(
      "durationMs debe ser un número válido y no negativo.",
    );
  }

  if (
    event.payload === null ||
    event.payload === undefined
  ) {
    errors.push(
      "El evento necesita un payload.",
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function isStageEventValid(
  event: StageEvent,
): boolean {
  return validateStageEvent(
    event,
  ).valid;
}

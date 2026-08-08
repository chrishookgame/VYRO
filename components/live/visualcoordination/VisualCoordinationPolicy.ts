import type {
  ScheduledPresentationEvent,
} from "../presentationdirector/types/PresentationEvent";

import type {
  VyroLiveCelebrationEvent,
} from "../celebrations/types";

export interface VisualCoordinationState {
  presentationEvent:
    ScheduledPresentationEvent | null;

  celebrationEvent:
    VyroLiveCelebrationEvent | null;
}

export interface VisualCoordinationDecision {
  showPresentation: boolean;
  showCelebration: boolean;
  celebrationBlocked: boolean;
}

export function resolveVisualCoordination(
  state: VisualCoordinationState,
): VisualCoordinationDecision {
  const hasPresentation =
    state.presentationEvent !== null;

  const hasCelebration =
    state.celebrationEvent !== null;

  if (hasPresentation) {
    return {
      showPresentation: true,
      showCelebration: false,
      celebrationBlocked: hasCelebration,
    };
  }

  return {
    showPresentation: false,
    showCelebration: hasCelebration,
    celebrationBlocked: false,
  };
}

export function canShowLiveCelebration(
  presentationEvent:
    ScheduledPresentationEvent | null,
): boolean {
  return presentationEvent === null;
}

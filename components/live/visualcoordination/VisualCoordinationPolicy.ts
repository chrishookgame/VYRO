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

  showGiftOverlay: boolean;
  showUniverseOverlay: boolean;
  showOrchestratorOverlay: boolean;
}

export function resolveVisualCoordination(
  state: VisualCoordinationState,
): VisualCoordinationDecision {
  const hasPresentation =
    state.presentationEvent !== null;

  const hasCelebration =
    state.celebrationEvent !== null;

  const hasCriticalPresentation =
    state.presentationEvent?.type ===
      "CHAMPION" ||
    state.presentationEvent?.type ===
      "WORLD_CHAMPION";

  if (hasPresentation) {
    return {
      showPresentation: true,
      showCelebration: false,
      celebrationBlocked: hasCelebration,

      showGiftOverlay:
        !hasCriticalPresentation,

      showUniverseOverlay:
        !hasCriticalPresentation,

      showOrchestratorOverlay:
        !hasCriticalPresentation,
    };
  }

  return {
    showPresentation: false,
    showCelebration: hasCelebration,
    celebrationBlocked: false,

    showGiftOverlay: true,
    showUniverseOverlay: true,
    showOrchestratorOverlay: true,
  };
}

export function canShowLiveCelebration(
  presentationEvent:
    ScheduledPresentationEvent | null,
): boolean {
  return presentationEvent === null;
}

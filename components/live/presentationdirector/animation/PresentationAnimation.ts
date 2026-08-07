import type {
  PresentationTransitionDurations,
  PresentationTransitionPhase,
} from "../transitions/PresentationTransition";

export interface PresentationAnimationStyle {
  opacity:number;
  scale:number;
  translateY:number;
}

export const DEFAULT_PRESENTATION_TRANSITION_DURATIONS:
PresentationTransitionDurations={
  enterMs:300,
  exitMs:300,
};

export function getPresentationAnimationStyle(
  phase:PresentationTransitionPhase,
):PresentationAnimationStyle{
  switch(phase){
    case "ENTER":
      return {
        opacity:0,
        scale:0.96,
        translateY:16,
      };

    case "VISIBLE":
      return {
        opacity:1,
        scale:1,
        translateY:0,
      };

    case "EXIT":
      return {
        opacity:0,
        scale:0.98,
        translateY:-12,
      };

    default:
      return {
        opacity:0,
        scale:1,
        translateY:0,
      };
  }
}

export function getPresentationAnimationTransition(){
  return "opacity 300ms ease, transform 300ms ease";
}

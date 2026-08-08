export interface TransitionDirectorInput {
  cameraMode:
    | "STABLE"
    | "FOCUS"
    | "IMPACT"
    | "CINEMATIC"
    | "WORLD";

  intensity:number;
  worldMoment:boolean;
}

export interface TransitionDirectorState {
  transition:
    | "NONE"
    | "FADE"
    | "PULSE"
    | "IMPACT"
    | "WORLD";

  durationMs:number;

  scale:number;

  blurPx:number;
}

export function createTransitionDirectorState(
  input:TransitionDirectorInput,
):TransitionDirectorState{
  if(
    input.worldMoment ||
    input.cameraMode === "WORLD"
  ){
    return {
      transition:"WORLD",
      durationMs:520,
      scale:1.06,
      blurPx:8,
    };
  }

  if(input.cameraMode === "CINEMATIC"){
    return {
      transition:"IMPACT",
      durationMs:420,
      scale:1.04,
      blurPx:6,
    };
  }

  if(input.cameraMode === "IMPACT"){
    return {
      transition:"PULSE",
      durationMs:320,
      scale:1.025,
      blurPx:3,
    };
  }

  if(
    input.cameraMode === "FOCUS" ||
    input.intensity >= 40
  ){
    return {
      transition:"FADE",
      durationMs:260,
      scale:1.01,
      blurPx:1,
    };
  }

  return {
    transition:"NONE",
    durationMs:200,
    scale:1,
    blurPx:0,
  };
}

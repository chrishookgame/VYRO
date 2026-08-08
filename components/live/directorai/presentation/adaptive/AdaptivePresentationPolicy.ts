import type {
  AIEventDirectorState,
} from "../../event/AIEventDirector";

import type {
  LiveStorylineState,
} from "../../storyline/LiveStorylineEngine";

export type AdaptivePresentationIntensity =
  | "SUBTLE"
  | "ENGAGED"
  | "EPIC"
  | "LEGENDARY";

export interface AdaptivePresentationPolicyInput {
  director:AIEventDirectorState;

  storyline:LiveStorylineState;

  excitementScore:number;

  universeLevel:
    | "NORMAL"
    | "GLOBAL"
    | "WORLD"
    | "LEGENDARY";
}

export interface AdaptivePresentationPolicy {
  intensity:
    AdaptivePresentationIntensity;

  durationMs:number;

  cooldownMs:number;

  priorityBoost:number;

  allowPreemption:boolean;

  cinematicScale:number;

  overlayStrength:number;

  repeatProtectionMs:number;
}

function clamp(
  value:number,
  minimum:number,
  maximum:number,
):number{
  return Math.min(
    maximum,
    Math.max(
      minimum,
      value,
    ),
  );
}

export function createAdaptivePresentationPolicy(
  input:AdaptivePresentationPolicyInput,
):AdaptivePresentationPolicy{
  const excitement=
    clamp(
      input.excitementScore,
      0,
      100,
    );

  const legendary=
    input.director.priority ===
      "CRITICAL" ||
    input.director.event ===
      "WORLD_CHAMPION" ||
    input.storyline.chapter ===
      "LEGENDARY" ||
    input.universeLevel ===
      "LEGENDARY";

  if(legendary){
    return {
      intensity:
        "LEGENDARY",

      durationMs:
        6500,

      cooldownMs:
        12000,

      priorityBoost:
        40,

      allowPreemption:
        true,

      cinematicScale:
        1.08,

      overlayStrength:
        1,

      repeatProtectionMs:
        18000,
    };
  }

  const epic=
    input.director.priority ===
      "HIGH" ||
    input.director.event ===
      "CHAMPION" ||
    input.storyline.chapter ===
      "WORLD" ||
    input.storyline.chapter ===
      "DECISIVE" ||
    input.universeLevel ===
      "WORLD" ||
    excitement >= 75;

  if(epic){
    return {
      intensity:
        "EPIC",

      durationMs:
        5000,

      cooldownMs:
        8000,

      priorityBoost:
        25,

      allowPreemption:
        true,

      cinematicScale:
        1.05,

      overlayStrength:
        0.88,

      repeatProtectionMs:
        12000,
    };
  }

  const engaged=
    input.director.priority ===
      "MEDIUM" ||
    input.storyline.chapter ===
      "RISING" ||
    input.universeLevel ===
      "GLOBAL" ||
    excitement >= 45;

  if(engaged){
    return {
      intensity:
        "ENGAGED",

      durationMs:
        3600,

      cooldownMs:
        5500,

      priorityBoost:
        10,

      allowPreemption:
        false,

      cinematicScale:
        1.025,

      overlayStrength:
        0.65,

      repeatProtectionMs:
        8000,
    };
  }

  return {
    intensity:
      "SUBTLE",

    durationMs:
      2500,

    cooldownMs:
      4000,

    priorityBoost:
      0,

    allowPreemption:
      false,

    cinematicScale:
      1,

    overlayStrength:
      0.4,

    repeatProtectionMs:
      6000,
  };
}

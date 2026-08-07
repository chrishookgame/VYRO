import type {
  PresentationEvent,
  PresentationEventType,
} from "../types/PresentationEvent";

export interface PresentationCooldownConfig {
  typeCooldownMs:number;
  creatorCooldownMs:number;
}

export interface PresentationCooldownMemory {
  typeLastShown:
    Partial<
      Record<
        PresentationEventType,
        number
      >
    >;

  creatorLastShown:
    Record<
      string,
      number
    >;
}

export const DEFAULT_PRESENTATION_COOLDOWN:
PresentationCooldownConfig={
  typeCooldownMs:8000,
  creatorCooldownMs:6000,
};

export function createPresentationCooldownMemory():
PresentationCooldownMemory{
  return {
    typeLastShown:{},
    creatorLastShown:{},
  };
}

export function isPresentationEventOnCooldown(
  event:PresentationEvent,
  memory:PresentationCooldownMemory,
  now:number,
  config:
    PresentationCooldownConfig =
      DEFAULT_PRESENTATION_COOLDOWN,
):boolean{
  const typeLastShown=
    memory.typeLastShown[
      event.type
    ];

  if(
    typeof typeLastShown === "number" &&
    now - typeLastShown <
      config.typeCooldownMs
  ){
    return true;
  }

  if(event.creatorId){
    const creatorLastShown=
      memory.creatorLastShown[
        event.creatorId
      ];

    if(
      typeof creatorLastShown === "number" &&
      now - creatorLastShown <
        config.creatorCooldownMs
    ){
      return true;
    }
  }

  return false;
}

export function rememberPresentationEvent(
  event:PresentationEvent,
  memory:PresentationCooldownMemory,
  now:number,
):PresentationCooldownMemory{
  return {
    typeLastShown:{
      ...memory.typeLastShown,

      [event.type]:
        now,
    },

    creatorLastShown:
      event.creatorId
        ? {
            ...memory.creatorLastShown,

            [event.creatorId]:
              now,
          }
        : memory.creatorLastShown,
  };
}

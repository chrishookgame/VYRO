export interface WorldLiveEventInput {
  momentumLevel:
    | "LOW"
    | "RISING"
    | "STRONG"
    | "EXTREME"
    | "UNSTOPPABLE";

  arenaStage:
    | "BASE"
    | "ENERGIZED"
    | "EPIC"
    | "WORLD"
    | "LEGENDARY";

  worldMoment:boolean;
  legendaryMoment:boolean;
}

export interface WorldLiveEventState {
  active:boolean;

  event:
    | "NONE"
    | "GLOBAL_SURGE"
    | "WORLD_EVENT"
    | "LEGENDARY_EVENT";
}

export function createWorldLiveEventState(
  input:WorldLiveEventInput,
):WorldLiveEventState{
  if(
    input.arenaStage === "LEGENDARY" &&
    (
      input.worldMoment ||
      input.legendaryMoment
    )
  ){
    return {
      active:true,
      event:"LEGENDARY_EVENT",
    };
  }

  if(
    input.arenaStage === "WORLD" ||
    input.worldMoment
  ){
    return {
      active:true,
      event:"WORLD_EVENT",
    };
  }

  if(
    input.momentumLevel === "EXTREME" ||
    input.momentumLevel === "UNSTOPPABLE"
  ){
    return {
      active:true,
      event:"GLOBAL_SURGE",
    };
  }

  return {
    active:false,
    event:"NONE",
  };
}

export interface WorldCelebrationInput {
  atmosphereLevel:
    | "CALM"
    | "RISING"
    | "HOT"
    | "EPIC"
    | "WORLD";

  crowdReaction:
    | "IDLE"
    | "CHEER"
    | "ROAR"
    | "ERUPTION";

  viral:boolean;
  legendaryMoment:boolean;
}

export interface WorldCelebrationState {
  active:boolean;

  celebration:
    | "NONE"
    | "HYPE"
    | "EPIC"
    | "WORLD_EVENT";
}

export function createWorldCelebrationState(
  input:WorldCelebrationInput,
):WorldCelebrationState{
  const worldEvent=
    input.atmosphereLevel === "WORLD" &&
    input.crowdReaction === "ERUPTION" &&
    (
      input.viral ||
      input.legendaryMoment
    );

  if(worldEvent){
    return {
      active:true,
      celebration:"WORLD_EVENT",
    };
  }

  if(
    input.atmosphereLevel === "EPIC" ||
    input.legendaryMoment
  ){
    return {
      active:true,
      celebration:"EPIC",
    };
  }

  if(
    input.atmosphereLevel === "HOT" ||
    input.crowdReaction === "ROAR"
  ){
    return {
      active:true,
      celebration:"HYPE",
    };
  }

  return {
    active:false,
    celebration:"NONE",
  };
}

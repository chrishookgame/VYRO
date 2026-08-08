export interface AIEventDirectorInput {
  excitementScore:number;

  prediction:
    | "STABLE"
    | "RISING_ACTION"
    | "MAJOR_MOMENT"
    | "WORLD_MOMENT"
    | "LEGENDARY_MOMENT";

  worldMoment:boolean;
  legendaryMoment:boolean;
}

export interface AIEventDirectorState {
  shouldPresent:boolean;

  event:
    | "NONE"
    | "SPOTLIGHT"
    | "BANNER"
    | "CHAMPION"
    | "WORLD_CHAMPION";

  priority:
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "CRITICAL";
}

export function createAIEventDirectorState(
  input:AIEventDirectorInput,
):AIEventDirectorState{
  if(
    input.legendaryMoment ||
    input.prediction === "LEGENDARY_MOMENT"
  ){
    return {
      shouldPresent:true,
      event:"WORLD_CHAMPION",
      priority:"CRITICAL",
    };
  }

  if(
    input.worldMoment ||
    input.prediction === "WORLD_MOMENT"
  ){
    return {
      shouldPresent:true,
      event:"CHAMPION",
      priority:"HIGH",
    };
  }

  if(
    input.prediction === "MAJOR_MOMENT" ||
    input.excitementScore >= 70
  ){
    return {
      shouldPresent:true,
      event:"SPOTLIGHT",
      priority:"HIGH",
    };
  }

  if(
    input.prediction === "RISING_ACTION" ||
    input.excitementScore >= 45
  ){
    return {
      shouldPresent:true,
      event:"BANNER",
      priority:"MEDIUM",
    };
  }

  return {
    shouldPresent:false,
    event:"NONE",
    priority:"LOW",
  };
}

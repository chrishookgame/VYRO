export interface LiveStorylineInput {
  creatorName?:string;
  excitementScore:number;

  prediction:
    | "STABLE"
    | "RISING_ACTION"
    | "MAJOR_MOMENT"
    | "WORLD_MOMENT"
    | "LEGENDARY_MOMENT";

  universeLevel:
    | "NORMAL"
    | "GLOBAL"
    | "WORLD"
    | "LEGENDARY";
}

export interface LiveStorylineState {
  active:boolean;

  chapter:
    | "NORMAL"
    | "RISING"
    | "DECISIVE"
    | "WORLD"
    | "LEGENDARY";

  title:string;
  message:string;
}

export function createLiveStorylineState(
  input:LiveStorylineInput,
):LiveStorylineState{
  const creator=
    input.creatorName?.trim() ||
    "VYRO Creator";

  if(
    input.prediction === "LEGENDARY_MOMENT" ||
    input.universeLevel === "LEGENDARY"
  ){
    return {
      active:true,
      chapter:"LEGENDARY",
      title:"LEGENDARY MOMENT",
      message:`${creator} está entrando en un momento histórico.`,
    };
  }

  if(
    input.prediction === "WORLD_MOMENT" ||
    input.universeLevel === "WORLD"
  ){
    return {
      active:true,
      chapter:"WORLD",
      title:"WORLD MOMENT",
      message:`${creator} está llevando el LIVE a nivel mundial.`,
    };
  }

  if(
    input.prediction === "MAJOR_MOMENT" ||
    input.excitementScore >= 70
  ){
    return {
      active:true,
      chapter:"DECISIVE",
      title:"DECISIVE MOMENT",
      message:`${creator} está entrando en una fase decisiva.`,
    };
  }

  if(
    input.prediction === "RISING_ACTION" ||
    input.excitementScore >= 40
  ){
    return {
      active:true,
      chapter:"RISING",
      title:"LIVE RISING",
      message:`La intensidad alrededor de ${creator} está aumentando.`,
    };
  }

  return {
    active:false,
    chapter:"NORMAL",
    title:"LIVE",
    message:"El LIVE continúa.",
  };
}

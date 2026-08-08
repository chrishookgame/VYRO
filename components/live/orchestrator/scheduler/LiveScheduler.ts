export interface LiveSchedulerInput {
  priority:number;
  cinematic:boolean;
  worldMoment:boolean;
}

export interface LiveSchedulerState {
  tickRateMs:number;
  presentationWindowMs:number;
  cooldownMs:number;
}

export function createLiveSchedulerState(
  input:LiveSchedulerInput,
):LiveSchedulerState{
  if(input.worldMoment){
    return {
      tickRateMs:100,
      presentationWindowMs:6000,
      cooldownMs:1800,
    };
  }

  if(
    input.cinematic ||
    input.priority >= 80
  ){
    return {
      tickRateMs:150,
      presentationWindowMs:4500,
      cooldownMs:1400,
    };
  }

  if(input.priority >= 50){
    return {
      tickRateMs:250,
      presentationWindowMs:3200,
      cooldownMs:1000,
    };
  }

  return {
    tickRateMs:500,
    presentationWindowMs:2200,
    cooldownMs:700,
  };
}

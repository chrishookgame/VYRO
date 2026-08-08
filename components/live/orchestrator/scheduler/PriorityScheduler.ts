import type {
  LiveOverlayChannel,
} from "../state/OrchestratorState";

export interface PrioritySchedulerInput {
  excitementScore:number;

  eventPriority:
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "CRITICAL";

  worldEventActive:boolean;

  storylineActive:boolean;

  explosive:boolean;
}

export interface PrioritySchedulerState {
  priority:number;

  channel:
    LiveOverlayChannel;

  interruptible:boolean;
}

export function createPrioritySchedulerState(
  input:PrioritySchedulerInput,
):PrioritySchedulerState{
  if(
    input.worldEventActive ||
    input.eventPriority === "CRITICAL"
  ){
    return {
      priority:100,
      channel:"WORLD_EVENT",
      interruptible:false,
    };
  }

  if(
    input.eventPriority === "HIGH" ||
    input.explosive
  ){
    return {
      priority:85,
      channel:"PRESENTATION",
      interruptible:false,
    };
  }

  if(
    input.storylineActive &&
    input.excitementScore >= 55
  ){
    return {
      priority:65,
      channel:"STORYLINE",
      interruptible:true,
    };
  }

  if(input.excitementScore >= 35){
    return {
      priority:45,
      channel:"COMBO",
      interruptible:true,
    };
  }

  if(input.excitementScore >= 15){
    return {
      priority:25,
      channel:"GIFT",
      interruptible:true,
    };
  }

  return {
    priority:0,
    channel:"NONE",
    interruptible:true,
  };
}

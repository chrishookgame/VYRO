import type {
  CompetitiveLiveEventType,
} from "../types/LiveCompetitiveTypes";

export interface CompetitiveCelebration {
  animation:
    | "NONE"
    | "SPARK"
    | "CONFETTI"
    | "FIREWORKS"
    | "CROWN";

  duration: number;

  sound: boolean;
  spotlight: boolean;
}

export function resolveCompetitiveCelebration(
  type: CompetitiveLiveEventType,
): CompetitiveCelebration {
  switch(type){
    case "CHAMPION":
      return {
        animation:"CROWN",
        duration:8000,
        sound:true,
        spotlight:true,
      };

    case "MVP":
      return {
        animation:"FIREWORKS",
        duration:6000,
        sound:true,
        spotlight:true,
      };

    case "RANK_UP":
    case "QUALIFIED":
      return {
        animation:"CONFETTI",
        duration:4500,
        sound:true,
        spotlight:true,
      };

    case "WIN_STREAK":
    case "UPSET":
      return {
        animation:"SPARK",
        duration:3000,
        sound:true,
        spotlight:false,
      };

    default:
      return {
        animation:"NONE",
        duration:0,
        sound:false,
        spotlight:false,
      };
  }
}

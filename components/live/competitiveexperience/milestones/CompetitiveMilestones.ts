import type {
  CompetitiveLiveEventType,
  LiveCompetitivePlayer,
} from "../types/LiveCompetitiveTypes";

export interface CompetitiveMilestone {
  type: CompetitiveLiveEventType;
  message: string;
  priority: number;
}

export function resolveCompetitiveMilestones(
  player: LiveCompetitivePlayer,
): CompetitiveMilestone[] {
  const milestones:CompetitiveMilestone[]=[];

  if(
    player.previousRank > 10 &&
    player.rank <= 10
  ){
    milestones.push({
      type:"RANK_UP",
      message:
        `${player.creatorName} entered the Global Top 10!`,
      priority:90,
    });
  }

  if(player.streak >= 10){
    milestones.push({
      type:"WIN_STREAK",
      message:
        `${player.creatorName} reached a ${player.streak}-win streak!`,
      priority:80,
    });
  }

  if(player.championships >= 1){
    milestones.push({
      type:"CHAMPION",
      message:
        `${player.creatorName} is a VYRO champion!`,
      priority:100,
    });
  }

  if(player.qualified){
    milestones.push({
      type:"QUALIFIED",
      message:
        `${player.creatorName} qualified for elite competition!`,
      priority:85,
    });
  }

  return milestones;
}

export interface ClanMission {
  id:string;
  title:string;

  progress:number;
  target:number;

  rewardCoins:number;
  rewardXp:number;

  completed:boolean;
}

export function calculateClanMissionProgress(
  progress:number,
  target:number,
) {
  return {
    percentage:
      Math.min(
        100,
        Math.round(
          progress * 100 /
          Math.max(target,1),
        ),
      ),

    completed:
      progress >= target,
  };
}

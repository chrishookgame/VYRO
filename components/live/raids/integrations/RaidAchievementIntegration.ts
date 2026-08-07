export interface RaidAchievementInput {
  defeatedBoss: boolean;
  mvp: boolean;
  damage: number;
  criticalHits: number;
}

export function resolveRaidAchievements(
  input: RaidAchievementInput,
) {
  const achievements:string[]=[];

  if(input.defeatedBoss){
    achievements.push(
      "BOSS_SLAYER",
    );
  }

  if(input.mvp){
    achievements.push(
      "RAID_MVP",
    );
  }

  if(input.damage >= 100000){
    achievements.push(
      "HEAVY_HITTER",
    );
  }

  if(input.criticalHits >= 25){
    achievements.push(
      "CRITICAL_MASTER",
    );
  }

  return achievements;
}

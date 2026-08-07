export type BossSkillType =
  | "NORMAL"
  | "POWER"
  | "HEAL"
  | "RAGE"
  | "ULTIMATE";

export interface BossSkill {
  id: string;

  name: string;

  type: BossSkillType;

  power: number;

  cooldownSeconds: number;

  healthThreshold: number | null;
}

export function canBossUseSkill(
  healthPercentage: number,
  skill: BossSkill,
) {
  if (
    skill.healthThreshold === null
  ) {
    return true;
  }

  return (
    healthPercentage <=
    skill.healthThreshold
  );
}

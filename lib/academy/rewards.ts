export type AcademyReward = {
  reason: string;
  points: number;
};

export const academyRewards = {
  courseCompleted: 100,
  certificateEarned: 200,
  badgeUnlocked: 150,
  levelUp: 500,
  dailyStreak: 50,
} as const;

export function getAcademyRewards(): AcademyReward[] {
  return [
    {
      reason: "Curso completado",
      points:
        academyRewards.courseCompleted,
    },
    {
      reason: "Certificado obtenido",
      points:
        academyRewards.certificateEarned,
    },
    {
      reason: "Insignia desbloqueada",
      points:
        academyRewards.badgeUnlocked,
    },
    {
      reason: "Subida de nivel",
      points:
        academyRewards.levelUp,
    },
    {
      reason: "Racha diaria",
      points:
        academyRewards.dailyStreak,
    },
  ];
}

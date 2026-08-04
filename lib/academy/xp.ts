export type StudentXp = {
  totalXp: number;
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  progress: number;
};

const XP_PER_LEVEL = 500;

export function calculateStudentXp(
  totalXp: number,
): StudentXp {
  const level =
    Math.floor(totalXp / XP_PER_LEVEL) + 1;

  const currentLevelXp =
    totalXp % XP_PER_LEVEL;

  const nextLevelXp =
    XP_PER_LEVEL;

  const progress =
    Math.round(
      (currentLevelXp / XP_PER_LEVEL) *
        100,
    );

  return {
    totalXp,
    level,
    currentLevelXp,
    nextLevelXp,
    progress,
  };
}

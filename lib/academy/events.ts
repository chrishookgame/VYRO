export type AcademyEvent =
  | "course_completed"
  | "certificate_earned"
  | "badge_unlocked"
  | "level_up"
  | "daily_streak";

export type AcademyEventReward = {
  event: AcademyEvent;
  rewardPoints: number;
};

const rewardMap: Record<
  AcademyEvent,
  number
> = {
  course_completed: 100,
  certificate_earned: 200,
  badge_unlocked: 150,
  level_up: 500,
  daily_streak: 50,
};

export function dispatchAcademyEvent(
  event: AcademyEvent,
): AcademyEventReward {
  return {
    event,
    rewardPoints:
      rewardMap[event],
  };
}

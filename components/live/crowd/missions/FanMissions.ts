export interface VyroFanMission {
  id: string;
  title: string;

  progress: number;
  target: number;

  rewardXp: number;
  rewardCoins: number;
}

export function calculateFanMission(
  mission: VyroFanMission,
) {
  const completed =
    mission.progress >=
    mission.target;

  return {
    ...mission,

    completed,

    percentage:
      Math.min(
        100,
        Math.round(
          mission.progress *
          100 /
          Math.max(
            mission.target,
            1,
          ),
        ),
      ),
  };
}

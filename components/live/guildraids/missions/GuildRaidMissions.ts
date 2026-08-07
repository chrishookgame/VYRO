export interface GuildRaidMission {
  id: string;

  title: string;

  progress: number;
  target: number;

  completed: boolean;
}

export function calculateGuildRaidMission(
  mission: GuildRaidMission,
) {
  return {
    ...mission,

    completed:
      mission.progress >=
      mission.target,

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

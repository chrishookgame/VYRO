export interface RaidHistoryEntry {
  raidId: string;

  bossId: string;
  bossName: string;

  participants: number;

  totalDamage: number;

  defeated: boolean;

  startedAt: number;
  finishedAt: number;
}

export function createRaidHistoryEntry(
  entry: RaidHistoryEntry,
): RaidHistoryEntry {
  return {
    ...entry,

    participants:
      Math.max(
        0,
        entry.participants,
      ),

    totalDamage:
      Math.max(
        0,
        entry.totalDamage,
      ),
  };
}

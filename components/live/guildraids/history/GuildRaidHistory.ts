export interface GuildRaidHistoryEntry {
  raidId: string;

  guildId: string;
  guildName: string;

  bossId: string;

  damage: number;

  victory: boolean;

  finishedAt: number;
}

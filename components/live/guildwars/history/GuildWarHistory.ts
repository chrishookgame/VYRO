export interface GuildWarHistoryEntry {
  warId: string;

  leftGuildId: string;
  rightGuildId: string;

  leftScore: number;
  rightScore: number;

  winnerId: string | null;

  finishedAt: number;
}

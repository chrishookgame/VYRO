export interface AllianceHistoryEntry {
  warId: string;

  leftAllianceId: string;
  rightAllianceId: string;

  leftScore: number;
  rightScore: number;

  winnerId: string | null;

  finishedAt: number;
}

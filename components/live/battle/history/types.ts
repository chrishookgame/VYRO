export interface BattleHistoryEntry {
  id: string;

  winnerName: string | null;
  mvpName: string | null;

  finalScore: string;

  completedRounds: number;
  intensity: number;

  title: string;
  summary: string;

  timestamp: number;
}

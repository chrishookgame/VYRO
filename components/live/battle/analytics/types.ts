export interface BattleAnalyticsSnapshot {
  totalEvents: number;
  roundsStarted: number;
  completedRounds: number;
  victories: number;
  draws: number;

  completionPercent: number;
  decisiveRate: number;
  drawRate: number;

  leftWins: number;
  rightWins: number;

  totalRounds: number;
  seriesFinished: boolean;
}

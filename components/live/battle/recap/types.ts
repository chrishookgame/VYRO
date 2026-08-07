export interface BattleRecapHighlight {
  id: string;
  title: string;
  description: string;
}

export interface BattleRecapTimelineItem {
  id: string;
  title: string;
  timestamp: number;
}

export interface BattleRecapData {
  winnerName: string | null;
  finalScore: string;
  mvp: string | null;

  summary: string;

  highlights: BattleRecapHighlight[];

  timeline: BattleRecapTimelineItem[];
}

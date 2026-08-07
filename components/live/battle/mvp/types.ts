export interface BattleMVPScore {
  creatorId: string;
  creatorName: string;
  score: number;

  winsScore: number;
  highlightScore: number;
  momentumScore: number;
  dominanceScore: number;
}

export interface BattleMVPResult {
  winner: BattleMVPScore | null;
  left: BattleMVPScore | null;
  right: BattleMVPScore | null;
  confidence: number;
  reason: string;
}

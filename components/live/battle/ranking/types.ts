export interface BattleRankingCreator {
  creatorId: string;
  creatorName: string;

  rank: number;
  previousRank: number;

  score: number;
  wins: number;
  losses: number;
  draws: number;

  streak: number;
  movement: number;

  status:
    | "rising"
    | "falling"
    | "stable";
}

export interface BattleRankingEvolutionData {
  left: BattleRankingCreator | null;
  right: BattleRankingCreator | null;

  leader: BattleRankingCreator | null;

  intensityBonus: number;
  battleWeight: number;
}

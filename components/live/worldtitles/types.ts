export interface WorldVyroKingHolder {
  creatorId: string;
  creatorName: string;

  countryCode: string;
  countryName: string;

  worldRank: number;

  score: number;
  totalWins: number;
  totalBattles: number;
  bestStreak: number;

  titleDefenses: number;

  active: boolean;

  acquiredAt: number | null;
  previousHolderName: string | null;
}

export interface WorldTitleDefenseEvent {
  id: string;

  holderId: string;
  holderName: string;

  challengerId: string;
  challengerName: string;

  holderScore: number;
  challengerScore: number;

  successful: boolean;

  defenseNumber: number;
}

export interface WorldVyroKingState {
  holder: WorldVyroKingHolder | null;

  latestDefense: WorldTitleDefenseEvent | null;

  totalDefenses: number;

  challengerName: string | null;

  dangerLevel:
    | "safe"
    | "watch"
    | "danger"
    | "critical";
}

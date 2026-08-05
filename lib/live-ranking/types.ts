export type LiveRankingType =
  | "gifter"
  | "energy"
  | "viewer"
  | "creator";

export type LiveRankingPeriod =
  | "live"
  | "daily"
  | "weekly"
  | "monthly"
  | "all_time";

export interface LiveRankingEntry {
  userId: string;
  score: number;
  giftsSent: number;
  giftValue: number;
  energyContributed: number;
  watchSeconds: number;
  reactionsSent: number;
}

export interface RankedLiveEntry extends LiveRankingEntry {
  position: number;
}

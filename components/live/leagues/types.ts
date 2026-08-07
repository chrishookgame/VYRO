export type VyroLeague =
  | "BRONZE"
  | "SILVER"
  | "GOLD"
  | "DIAMOND"
  | "ROYAL"
  | "INFINITY";

export interface VyroLeaguePlayer {
  creatorId: string;
  creatorName: string;

  league: VyroLeague;

  leaguePoints: number;

  wins: number;
  losses: number;

  streak: number;

  promotionProgress: number;
  relegationRisk: number;

  worldRank: number;
}

export interface VyroLeagueState {
  currentLeague: VyroLeague;

  player: VyroLeaguePlayer | null;

  nextLeague: VyroLeague | null;

  previousLeague: VyroLeague | null;

  season: number;
}

import type {
  CompetitiveTier,
} from "../types/CompetitiveCoreTypes";

export interface CompetitiveHistoryEntry {
  season: number;

  creatorId: string;
  creatorName: string;

  countryCode: string;

  finalRank: number;

  competitivePower: number;

  tier: CompetitiveTier;

  championships: number;
  wins: number;

  finishedAt: number;
}

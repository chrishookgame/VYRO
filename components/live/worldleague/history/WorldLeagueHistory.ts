import type {
  WorldLeagueDivision,
} from "../types/WorldLeagueTypes";

export interface WorldLeagueHistoryEntry {
  season: number;

  creatorId: string;
  creatorName: string;

  division: WorldLeagueDivision;

  finalRank: number;
  leaguePoints: number;

  promoted: boolean;
  relegated: boolean;

  finishedAt: number;
}

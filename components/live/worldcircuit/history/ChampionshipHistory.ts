export interface ChampionshipHistoryEntry {
  championshipId: string;

  season: number;

  championId: string;
  championName: string;

  countryCode: string;

  circuitPoints: number;

  finishedAt: number;
}

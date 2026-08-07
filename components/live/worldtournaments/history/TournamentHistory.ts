export interface TournamentHistoryEntry {
  tournamentId: string;

  season: number;

  championId: string;
  championName: string;

  countryCode: string;

  finalScore: number;

  finishedAt: number;
}

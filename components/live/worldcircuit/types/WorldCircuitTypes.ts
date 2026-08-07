export interface WorldCircuitCompetitor {
  creatorId: string;
  creatorName: string;
  countryCode: string;

  tournamentPoints: number;
  guildWarPoints: number;
  alliancePoints: number;
  raidPoints: number;
  seasonPoints: number;

  victories: number;
  championships: number;
}

export interface WorldCircuitState {
  season: number;

  competitors: WorldCircuitCompetitor[];

  qualified: number;

  championId: string | null;

  active: boolean;
}

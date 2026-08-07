export type CompetitiveTier =
  | "ROOKIE"
  | "CONTENDER"
  | "ELITE"
  | "MASTER"
  | "LEGEND"
  | "WORLD";

export interface CompetitivePlayer {
  creatorId: string;
  creatorName: string;
  countryCode: string;

  leaguePoints: number;
  circuitPoints: number;
  tournamentPoints: number;
  guildWarPoints: number;
  alliancePoints: number;
  raidPoints: number;
  seasonPoints: number;

  wins: number;
  losses: number;
  championships: number;

  tier: CompetitiveTier;
}

export interface CompetitiveCoreState {
  season: number;

  players: CompetitivePlayer[];

  active: boolean;

  qualifiedPlayers: number;
}

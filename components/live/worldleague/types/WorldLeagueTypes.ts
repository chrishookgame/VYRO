export type WorldLeagueDivision =
  | "BRONZE"
  | "SILVER"
  | "GOLD"
  | "DIAMOND"
  | "ROYAL"
  | "INFINITY";

export interface WorldLeaguePlayer {
  creatorId: string;
  creatorName: string;
  countryCode: string;

  division: WorldLeagueDivision;

  leaguePoints: number;
  circuitPoints: number;

  wins: number;
  losses: number;
  streak: number;

  championships: number;
}

export interface WorldLeagueState {
  season: number;

  players: WorldLeaguePlayer[];

  active: boolean;
}

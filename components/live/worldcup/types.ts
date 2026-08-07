export interface VyroWorldCupCountry {
  countryCode: string;
  countryName: string;

  rank: number;

  score: number;
  totalWins: number;
  totalBattles: number;

  kingName: string | null;

  topCreators: string[];

  momentum: number;
}

export interface VyroWorldCupMatchup {
  id: string;

  left: VyroWorldCupCountry;
  right: VyroWorldCupCountry;

  leftProbability: number;
  rightProbability: number;

  hypeMessage: string;
}

export interface VyroWorldCupData {
  countries: VyroWorldCupCountry[];

  leader: VyroWorldCupCountry | null;

  featuredMatchup: VyroWorldCupMatchup | null;

  seasonName: string;
  seasonNumber: number;
}

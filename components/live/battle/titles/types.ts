export type VyroNationalTitle =
  | "VYRO_KING"
  | "VYRO_LEGEND"
  | "VYRO_ELITE";

export interface VyroTitleHolder {
  creatorId: string;
  creatorName: string;

  countryCode: string;
  countryName: string;

  title: VyroNationalTitle;

  rank: 1 | 2 | 3;

  score: number;
  followers: number;
  battleWins: number;
  battleCount: number;

  active: boolean;

  acquiredAt: number | null;
  previousHolderName: string | null;
}

export interface VyroTitleChangeEvent {
  id: string;

  countryCode: string;
  countryName: string;

  title: VyroNationalTitle;

  previousHolderName: string | null;
  newHolderName: string;

  previousScore: number;
  newScore: number;

  changed: boolean;
}

export interface VyroTitlesState {
  king: VyroTitleHolder | null;
  legend: VyroTitleHolder | null;
  elite: VyroTitleHolder | null;

  changes: VyroTitleChangeEvent[];
}

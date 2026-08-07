export interface VyroHallOfFameEntry {
  creatorId: string;
  creatorName: string;

  countryCode: string;
  countryName: string;

  currentTitle: string | null;

  highestTitle: string | null;

  totalWins: number;
  totalBattles: number;

  bestStreak: number;

  championships: number;
  titleDefenses: number;

  daysAsChampion: number;

  score: number;

  legacyScore: number;

  inducted: boolean;
}

export interface VyroHallOfFameData {
  entries: VyroHallOfFameEntry[];

  leader: VyroHallOfFameEntry | null;

  totalLegends: number;
}

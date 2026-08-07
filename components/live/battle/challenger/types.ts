export interface NextChallengerPrediction {
  creatorId: string;
  creatorName: string;

  countryCode: string;

  level: string;

  score: number;
  followers: number;
  battleWins: number;
  winRate: number;
  streak: number;

  victoryProbability: number;

  title: string | null;
}

export interface NextChallengerData {
  champion: NextChallengerPrediction | null;
  challenger: NextChallengerPrediction | null;

  headline: string;
  subtitle: string;

  hypeMessage: string;

  confidence: number;
}

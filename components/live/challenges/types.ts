export type VyroChallengeType =
  | "DAILY"
  | "BATTLE"
  | "CREATOR"
  | "COMMUNITY";

export interface VyroChallenge {
  id: string;
  title: string;
  description: string;
  type: VyroChallengeType;

  creatorId: string | null;

  progress: number;
  target: number;

  rewardCoins: number;
  rewardXp: number;

  streak: number;

  active: boolean;
  completed: boolean;
}

export interface VyroChallengeState {
  challenges: VyroChallenge[];

  active: number;
  completed: number;
  totalProgress: number;
}

export interface VyroChallengeLeaderboardPlayer {
  creatorId: string;
  creatorName: string;

  score: number;
  completedChallenges: number;
  streak: number;
}

export type VyroClanRole =
  | "OWNER"
  | "CAPTAIN"
  | "ELITE"
  | "MEMBER";

export interface VyroClanMember {
  creatorId: string;
  creatorName: string;

  role: VyroClanRole;

  score: number;
  wins: number;
  contribution: number;
}

export interface VyroClan {
  id: string;
  name: string;

  countryCode: string;

  level: number;
  score: number;

  wins: number;
  losses: number;

  streak: number;

  members: VyroClanMember[];
}

export interface VyroClanState {
  clans: VyroClan[];

  leader: VyroClan | null;

  totalClans: number;
}

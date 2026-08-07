export type VyroWarType =
  | "GUILD"
  | "CROSS_SERVER"
  | "WORLD";

export interface VyroWarTeam {
  id: string;
  name: string;
  countryCode: string;

  score: number;
  wins: number;
  streak: number;

  members: number;
}

export interface VyroWar {
  id: string;
  type: VyroWarType;

  left: VyroWarTeam;
  right: VyroWarTeam;

  leftScore: number;
  rightScore: number;

  active: boolean;
  winnerId: string | null;
}

export interface VyroWarState {
  wars: VyroWar[];

  activeWars: number;
  completedWars: number;

  strongestTeam: VyroWarTeam | null;
}

export interface VyroRaidPlayer {
  creatorId: string;
  creatorName: string;

  damage: number;
  support: number;
  victories: number;
}

export interface VyroRaidBoss {
  id: string;
  name: string;

  level: number;

  maxHealth: number;
  currentHealth: number;

  enraged: boolean;
  defeated: boolean;
}

export interface VyroAlliance {
  id: string;
  name: string;

  countryCode: string;

  clans: number;
  members: number;

  score: number;
  wins: number;
  streak: number;
}

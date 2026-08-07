export interface AllianceGuild {
  guildId: string;
  guildName: string;

  countryCode: string;

  power: number;
  members: number;
  victories: number;
}

export interface GlobalAlliance {
  allianceId: string;
  allianceName: string;

  guilds: AllianceGuild[];

  score: number;
  wins: number;
  losses: number;
  streak: number;
}

export interface AllianceWar {
  id: string;

  left: GlobalAlliance;
  right: GlobalAlliance;

  leftScore: number;
  rightScore: number;

  winnerId: string | null;

  active: boolean;
}

export interface GlobalAllianceState {
  season: number;

  alliances: GlobalAlliance[];
  wars: AllianceWar[];
}

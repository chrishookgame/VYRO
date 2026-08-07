export interface GuildRaidMember {
  creatorId: string;
  creatorName: string;

  damage: number;
  support: number;
  criticalHits: number;
}

export interface GuildRaidTeam {
  guildId: string;
  guildName: string;

  members: GuildRaidMember[];

  score: number;
  victories: number;
}

export interface GuildRaidState {
  raidId: string;

  bossId: string;

  teams: GuildRaidTeam[];

  active: boolean;
}

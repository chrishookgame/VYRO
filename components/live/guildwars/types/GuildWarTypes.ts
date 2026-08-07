export interface GuildWarGuild {
  guildId: string;
  guildName: string;

  countryCode: string;

  power: number;
  wins: number;
  losses: number;
  streak: number;
}

export interface GuildWarBattle {
  id: string;

  left: GuildWarGuild;
  right: GuildWarGuild;

  leftScore: number;
  rightScore: number;

  winnerId: string | null;

  active: boolean;
}

export interface GuildWarState {
  season: number;

  battles: GuildWarBattle[];

  activeBattles: number;
  completedBattles: number;
}

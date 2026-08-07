import type {
  GuildWarBattle,
  GuildWarState,
} from "../types/GuildWarTypes";

export function createGuildWarState(
  season: number,
  battles: GuildWarBattle[],
): GuildWarState {
  return {
    season,
    battles,

    activeBattles:
      battles.filter(
        battle => battle.active,
      ).length,

    completedBattles:
      battles.filter(
        battle => !battle.active,
      ).length,
  };
}

import type {
  GuildWarGuild,
} from "../types/GuildWarTypes";

export function createGuildWarRanking(
  guilds: GuildWarGuild[],
) {
  return [...guilds]
    .sort(
      (a,b) => {
        const aScore =
          a.power +
          a.wins * 1000 +
          a.streak * 250;

        const bScore =
          b.power +
          b.wins * 1000 +
          b.streak * 250;

        return bScore - aScore;
      },
    )
    .map(
      (guild,index) => ({
        ...guild,
        worldRank:index+1,
      }),
    );
}

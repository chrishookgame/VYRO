import type {
  GuildRaidTeam,
} from "../types/GuildRaidTypes";

export function createGuildRaidRanking(
  teams: GuildRaidTeam[],
) {
  return [...teams]
    .sort(
      (a,b) =>
        (
          b.score +
          b.victories * 1000
        ) -
        (
          a.score +
          a.victories * 1000
        ),
    )
    .map(
      (team,index) => ({
        ...team,

        rank:
          index + 1,
      }),
    );
}

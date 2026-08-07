import type {
  GuildWarGuild,
} from "../types/GuildWarTypes";

export function createGuildMatchups(
  guilds: GuildWarGuild[],
) {
  const sorted =
    [...guilds].sort(
      (a,b) =>
        b.power -
        a.power,
    );

  const matches:{
    left:GuildWarGuild;
    right:GuildWarGuild;
  }[]=[];

  for(
    let index=0;
    index+1<sorted.length;
    index+=2
  ){
    matches.push({
      left:sorted[index],
      right:sorted[index+1],
    });
  }

  return matches;
}

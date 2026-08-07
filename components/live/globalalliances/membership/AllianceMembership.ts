import type {
  AllianceGuild,
  GlobalAlliance,
} from "../types/GlobalAllianceTypes";

export function addGuildToAlliance(
  alliance: GlobalAlliance,
  guild: AllianceGuild,
): GlobalAlliance {
  const alreadyExists =
    alliance.guilds.some(
      item =>
        item.guildId ===
        guild.guildId,
    );

  if(alreadyExists){
    return alliance;
  }

  return {
    ...alliance,

    guilds:[
      ...alliance.guilds,
      guild,
    ],
  };
}

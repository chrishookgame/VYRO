import type {
  GlobalAlliance,
} from "../types/GlobalAllianceTypes";

export function calculateAlliancePower(
  alliance: GlobalAlliance,
) {
  const guildPower =
    alliance.guilds.reduce(
      (total,guild) =>
        total +
        Math.max(
          0,
          guild.power,
        ),
      0,
    );

  const members =
    alliance.guilds.reduce(
      (total,guild) =>
        total +
        Math.max(
          0,
          guild.members,
        ),
      0,
    );

  return {
    guildPower,
    members,

    power:
      guildPower +
      alliance.wins * 1000 +
      alliance.streak * 250,
  };
}

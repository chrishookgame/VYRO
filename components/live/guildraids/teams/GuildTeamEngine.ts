import type {
  GuildRaidTeam,
} from "../types/GuildRaidTypes";

export function calculateGuildTeamPower(
  team: GuildRaidTeam,
) {
  const damage =
    team.members.reduce(
      (total,member) =>
        total +
        Math.max(
          0,
          member.damage,
        ),
      0,
    );

  const support =
    team.members.reduce(
      (total,member) =>
        total +
        Math.max(
          0,
          member.support,
        ),
      0,
    );

  const criticalHits =
    team.members.reduce(
      (total,member) =>
        total +
        Math.max(
          0,
          member.criticalHits,
        ),
      0,
    );

  return {
    damage,
    support,
    criticalHits,

    power:
      damage +
      support +
      criticalHits * 250,
  };
}

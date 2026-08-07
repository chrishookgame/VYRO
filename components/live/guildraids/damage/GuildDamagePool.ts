import type {
  GuildRaidTeam,
} from "../types/GuildRaidTypes";

export function calculateGuildRaidDamage(
  team: GuildRaidTeam,
) {
  return team.members.reduce(
    (total,member) =>
      total +
      Math.max(
        0,
        member.damage,
      ),
    0,
  );
}

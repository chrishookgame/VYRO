import type {
  VyroAlliance,
} from "@/components/live/wars/types";

export function calculateAlliancePower(
  alliance: VyroAlliance,
) {
  const power =
    alliance.score +
    alliance.wins * 250 +
    alliance.streak * 100 +
    alliance.clans * 500 +
    alliance.members * 25;

  return {
    ...alliance,
    power,
  };
}

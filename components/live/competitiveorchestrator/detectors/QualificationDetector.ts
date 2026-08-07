import type {
  CompetitiveOrchestratorPlayer,
} from "../types/CompetitiveOrchestratorTypes";

export function detectQualificationStatus(
  player: CompetitiveOrchestratorPlayer,
) {
  return {
    qualified:
      player.qualified,

    eliteQualified:
      player.qualified &&
      player.competitivePower >= 25000,

    worldQualified:
      player.qualified &&
      player.competitivePower >= 100000,
  };
}

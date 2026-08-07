import type {
  CompetitiveOrchestratorPlayer,
} from "../types/CompetitiveOrchestratorTypes";

export function detectChampionStatus(
  player: CompetitiveOrchestratorPlayer,
) {
  return {
    champion:
      player.championships >= 1,

    multiChampion:
      player.championships >= 3,

    legendaryChampion:
      player.championships >= 10,
  };
}

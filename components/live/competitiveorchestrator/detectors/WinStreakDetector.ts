import type {
  CompetitiveOrchestratorPlayer,
} from "../types/CompetitiveOrchestratorTypes";

export function detectWinStreak(
  player: CompetitiveOrchestratorPlayer,
) {
  return {
    active:
      player.streak >= 3,

    hot:
      player.streak >= 5,

    elite:
      player.streak >= 10,

    legendary:
      player.streak >= 20,
  };
}

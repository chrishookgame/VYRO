import type {
  CompetitiveOrchestratorPlayer,
} from "../types/CompetitiveOrchestratorTypes";

export function detectRankChange(
  player: CompetitiveOrchestratorPlayer,
) {
  const movement =
    player.previousRank -
    player.rank;

  return {
    movedUp:
      movement > 0,

    movedDown:
      movement < 0,

    movement:
      Math.abs(
        movement,
      ),

    enteredTop10:
      player.previousRank > 10 &&
      player.rank <= 10,

    enteredTop3:
      player.previousRank > 3 &&
      player.rank <= 3,

    becameNumberOne:
      player.previousRank !== 1 &&
      player.rank === 1,
  };
}

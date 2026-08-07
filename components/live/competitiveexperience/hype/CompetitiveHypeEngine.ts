import type {
  LiveCompetitivePlayer,
} from "../types/LiveCompetitiveTypes";

export function calculateCompetitiveHype(
  players: LiveCompetitivePlayer[],
) {
  if(players.length === 0){
    return 0;
  }

  const streakPower =
    players.reduce(
      (total,player) =>
        total +
        Math.min(
          20,
          Math.max(
            0,
            player.streak,
          ),
        ),
      0,
    );

  const championshipPower =
    players.reduce(
      (total,player) =>
        total +
        Math.min(
          10,
          Math.max(
            0,
            player.championships,
          ) * 2,
        ),
      0,
    );

  const rankMovement =
    players.reduce(
      (total,player) =>
        total +
        Math.min(
          10,
          Math.max(
            0,
            player.previousRank -
            player.rank,
          ),
        ),
      0,
    );

  const rawHype =
    (
      streakPower +
      championshipPower +
      rankMovement
    ) /
    players.length *
    3;

  return Math.min(
    100,
    Math.max(
      0,
      Math.round(
        rawHype,
      ),
    ),
  );
}

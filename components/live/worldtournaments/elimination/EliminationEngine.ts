import type {
  WorldTournamentPlayer,
} from "../types/WorldTournamentTypes";

export function eliminateTournamentPlayer(
  player: WorldTournamentPlayer,
): WorldTournamentPlayer {
  return {
    ...player,
    eliminated:true,
  };
}

export function getActiveTournamentPlayers(
  players: WorldTournamentPlayer[],
) {
  return players.filter(
    player =>
      !player.eliminated,
  );
}

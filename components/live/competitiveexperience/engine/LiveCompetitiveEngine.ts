import type {
  LiveCompetitiveEvent,
  LiveCompetitivePlayer,
  LiveCompetitiveState,
} from "../types/LiveCompetitiveTypes";

export function createLiveCompetitiveState(
  players: LiveCompetitivePlayer[],
  events: LiveCompetitiveEvent[],
  hype: number,
  active: boolean,
): LiveCompetitiveState {
  return {
    players,
    events,

    hype:
      Math.min(
        100,
        Math.max(
          0,
          Math.round(
            hype,
          ),
        ),
      ),

    active,
  };
}

import type {
  AllianceWar,
  GlobalAlliance,
  GlobalAllianceState,
} from "../types/GlobalAllianceTypes";

export function createGlobalAllianceState(
  season: number,
  alliances: GlobalAlliance[],
  wars: AllianceWar[],
): GlobalAllianceState {
  return {
    season,
    alliances,
    wars,
  };
}

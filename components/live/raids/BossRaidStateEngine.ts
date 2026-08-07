import type {
  RaidState,
} from "./types";

export function createBossRaidState(
  state: RaidState,
): RaidState {
  return {
    ...state,
  };
}

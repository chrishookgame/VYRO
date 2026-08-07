import type {
  VyroClan,
  VyroClanState,
} from "./types";

export function createClanState(
  clans: VyroClan[],
): VyroClanState {
  const ranked =
    [...clans].sort(
      (a,b) => b.score - a.score,
    );

  return {
    clans: ranked,

    leader:
      ranked[0] ?? null,

    totalClans:
      ranked.length,
  };
}

import type {
  VyroClan,
} from "../types";

export function createCountryClanRanking(
  clans:VyroClan[],
  countryCode:string,
) {
  return clans
    .filter(
      clan =>
        clan.countryCode ===
        countryCode,
    )
    .sort(
      (a,b) =>
        b.score - a.score,
    )
    .map(
      (clan,index) => ({
        ...clan,
        countryRank:
          index + 1,
      }),
    );
}

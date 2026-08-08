import type {
  GlobalComboRankingEntry,
} from "../../combo/ranking/GlobalComboRanking";

export interface WorldGiftLeaderboardEntry
  extends GlobalComboRankingEntry {
  position:number;
}

export function createWorldGiftLeaderboard(
  ranking:GlobalComboRankingEntry[],
  limit=10,
):WorldGiftLeaderboardEntry[]{
  const safeLimit=
    Math.max(
      1,
      Math.floor(
        limit,
      ),
    );

  return ranking
    .slice(
      0,
      safeLimit,
    )
    .map(
      (
        entry,
        index,
      ) => ({
        ...entry,
        position:
          index + 1,
      }),
    );
}

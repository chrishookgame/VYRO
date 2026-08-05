import type {
  LiveRankingEntry,
  LiveRankingType,
  RankedLiveEntry,
} from "./types";

export class LiveRankingEngine {
  calculateScore(
    entry: LiveRankingEntry,
    rankingType: LiveRankingType,
  ): number {
    if (rankingType === "gifter") {
      return Math.round(
        entry.giftValue * 100 +
        entry.giftsSent * 10,
      );
    }

    if (rankingType === "energy") {
      return Math.round(
        entry.energyContributed +
        entry.reactionsSent * 2,
      );
    }

    if (rankingType === "viewer") {
      return Math.round(
        entry.watchSeconds +
        entry.reactionsSent * 5,
      );
    }

    return Math.round(
      entry.giftValue * 25 +
      entry.energyContributed +
      entry.watchSeconds / 10,
    );
  }

  rank(
    entries: LiveRankingEntry[],
    rankingType: LiveRankingType,
  ): RankedLiveEntry[] {
    return entries
      .map((entry) => ({
        ...entry,
        score: this.calculateScore(
          entry,
          rankingType,
        ),
      }))
      .sort((a, b) => b.score - a.score)
      .map((entry, index) => ({
        ...entry,
        position: index + 1,
      }));
  }
}

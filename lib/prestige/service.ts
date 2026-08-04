import { VYRO_PRESTIGE_RANKS } from "./ranks";
import type {
  PrestigeRankDefinition,
  UserPrestige,
  VyroPrestigeRank,
} from "./types";

export class PrestigeEngine {
  getRankByXp(xp: number): PrestigeRankDefinition {
    const safeXp = Math.max(0, xp);

    return [...VYRO_PRESTIGE_RANKS]
      .reverse()
      .find((rank) => safeXp >= rank.minimumXp) ?? VYRO_PRESTIGE_RANKS[0];
  }

  getRank(rankId: VyroPrestigeRank): PrestigeRankDefinition | undefined {
    return VYRO_PRESTIGE_RANKS.find((rank) => rank.id === rankId);
  }

  getNextRank(xp: number): PrestigeRankDefinition | null {
    const currentRank = this.getRankByXp(xp);

    return (
      VYRO_PRESTIGE_RANKS.find(
        (rank) => rank.priority === currentRank.priority + 1,
      ) ?? null
    );
  }

  calculateProgress(xp: number): number {
    const safeXp = Math.max(0, xp);
    const currentRank = this.getRankByXp(safeXp);
    const nextRank = this.getNextRank(safeXp);

    if (!nextRank) {
      return 100;
    }

    const currentRange = nextRank.minimumXp - currentRank.minimumXp;

    if (currentRange <= 0) {
      return 100;
    }

    const earnedInCurrentRank = safeXp - currentRank.minimumXp;

    return Math.min(
      100,
      Math.max(0, Math.round((earnedInCurrentRank / currentRange) * 100)),
    );
  }

  getUserPrestige(userId: string, xp: number): UserPrestige {
    const currentRank = this.getRankByXp(xp);
    const nextRank = this.getNextRank(xp);

    return {
      userId,
      xp: Math.max(0, xp),
      rank: currentRank.id,
      nextRank: nextRank?.id ?? null,
      progress: this.calculateProgress(xp),
    };
  }
}

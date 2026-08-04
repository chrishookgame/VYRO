import {
  rewardCatalog,
  type RewardEventType,
} from "./index";
import {
  addRewardHistory,
  type RewardHistoryItem,
} from "./history";
import {
  addXp,
  type XpTransaction,
} from "@/lib/xp";
import {
  addWalletTransaction,
  type WalletTransaction,
} from "@/lib/wallet";

export type RewardEngineResult = {
  success: boolean;
  reward?: {
    reason: string;
    xp: number;
    coins: number;
  };
  historyItem?: RewardHistoryItem;
  xpTransaction?: XpTransaction;
  walletTransaction?: WalletTransaction;
  error?: string;
};

export function processReward(
  userId: string,
  rewardKey: keyof typeof rewardCatalog,
): RewardEngineResult {
  const cleanUserId = userId.trim();

  if (!cleanUserId) {
    return {
      success: false,
      error:
        "El identificador del usuario es obligatorio.",
    };
  }

  const reward =
    rewardCatalog[rewardKey];

  if (!reward) {
    return {
      success: false,
      error:
        "La recompensa no existe.",
    };
  }

  const historyItem: RewardHistoryItem = {
    id: crypto.randomUUID(),
    userId: cleanUserId,
    type:
      reward.type as RewardEventType,
    reason: reward.reason,
    xp: reward.xp,
    coins: reward.coins,
    createdAt:
      new Date().toISOString(),
  };

  addRewardHistory(
    historyItem,
  );

  const xpTransaction =
    reward.xp > 0
      ? addXp(
          cleanUserId,
          reward.xp,
          reward.reason,
        )
      : undefined;

  const walletTransaction =
    reward.coins > 0
      ? addWalletTransaction({
          id: crypto.randomUUID(),
          userId: cleanUserId,
          amount: reward.coins,
          type: "credit",
          reason: reward.reason,
          createdAt:
            new Date().toISOString(),
        })
      : undefined;

  return {
    success: true,
    reward: {
      reason: reward.reason,
      xp: reward.xp,
      coins: reward.coins,
    },
    historyItem,
    xpTransaction,
    walletTransaction,
  };
}

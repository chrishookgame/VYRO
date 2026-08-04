export type RewardHistoryItem = {
  id: string;
  userId: string;
  type: string;
  reason: string;
  xp: number;
  coins: number;
  createdAt: string;
};

const rewardHistory: RewardHistoryItem[] = [];

export function addRewardHistory(
  reward: RewardHistoryItem,
) {
  rewardHistory.unshift(reward);

  return rewardHistory;
}

export function getRewardHistory(
  userId: string,
) {
  return rewardHistory.filter(
    (item) =>
      item.userId === userId,
  );
}

export function getAllRewardHistory() {
  return rewardHistory;
}
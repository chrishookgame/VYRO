export type XpTransaction = {
  userId: string;
  amount: number;
  reason: string;
  createdAt: string;
};

const xpHistory: XpTransaction[] = [];

export function addXp(
  userId: string,
  amount: number,
  reason: string,
) {
  const transaction: XpTransaction = {
    userId,
    amount,
    reason,
    createdAt:
      new Date().toISOString(),
  };

  xpHistory.unshift(transaction);

  return transaction;
}

export function getXpHistory(
  userId: string,
) {
  return xpHistory.filter(
    (transaction) =>
      transaction.userId === userId,
  );
}

export function getTotalXp(
  userId: string,
) {
  return getXpHistory(
    userId,
  ).reduce(
    (total, transaction) =>
      total + transaction.amount,
    0,
  );
}
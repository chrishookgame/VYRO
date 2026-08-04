export type WalletTransaction = {
  id: string;
  userId: string;
  amount: number;
  type: "credit" | "debit";
  reason: string;
  createdAt: string;
};

const walletHistory: WalletTransaction[] = [];

export function addWalletTransaction(
  transaction: WalletTransaction,
) {
  walletHistory.unshift(transaction);
  return transaction;
}

export function getWalletHistory(
  userId: string,
) {
  return walletHistory.filter(
    (transaction) =>
      transaction.userId === userId,
  );
}

export function getWalletBalance(
  userId: string,
) {
  return getWalletHistory(userId).reduce(
    (balance, transaction) =>
      transaction.type === "credit"
        ? balance + transaction.amount
        : balance - transaction.amount,
    0,
  );
}

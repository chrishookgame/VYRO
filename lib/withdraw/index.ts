export type WithdrawStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "paid";

export type WithdrawRequest = {
  id: string;
  userId: string;
  amount: number;
  createdAt: string;
  status: WithdrawStatus;
};

export function createWithdrawRequest(
  userId: string,
  amount: number,
): WithdrawRequest {

  return {
    id: crypto.randomUUID(),
    userId: userId.trim(),
    amount,
    createdAt:
      new Date().toISOString(),
    status: "pending",
  };

}

export function canWithdraw(
  balance: number,
  amount: number,
) {

  return (
    amount > 0 &&
    amount <= balance
  );

}

export * from "./service";

export * from "./service";

import {
  executeDataRequest,
  type DataResult,
} from "@/lib/core";

export type WalletRecord = {
  id: string;
  userId: string;
  available: number;
  pending: number;
  totalEarned: number;
};

export class WalletRepository {
  async findByUserId(
    userId: string,
  ): Promise<DataResult<WalletRecord>> {
    return executeDataRequest(async () => ({
      id: "",
      userId,
      available: 0,
      pending: 0,
      totalEarned: 0,
    }));
  }
}

export const walletRepository =
  new WalletRepository();

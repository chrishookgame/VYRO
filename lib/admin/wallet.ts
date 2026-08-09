import { supabase } from "@/lib/supabase";

export type AdminWalletRow = {
  id: string;
  user_id: string;
  available_balance: number | string | null;
  pending_balance: number | string | null;
  lifetime_earnings: number | string | null;
  lifetime_withdrawals: number | string | null;
  created_at: string;
  updated_at: string;
};

export type AdminWalletTransactionRow = {
  id: string;
  wallet_id: string;
  type: string;
  amount: number | string;
  description: string | null;
  reference: string | null;
  created_at: string;
};

export type AdminWalletProfileRow = {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
};

export type AdminWalletSnapshot = {
  wallets: AdminWalletRow[];
  transactions: AdminWalletTransactionRow[];
  profiles: AdminWalletProfileRow[];
};

export async function getAdminWalletSnapshot(): Promise<AdminWalletSnapshot> {
  const [
    walletsResult,
    transactionsResult,
    profilesResult,
  ] = await Promise.all([
    supabase
      .from("wallets")
      .select(
        "id,user_id,available_balance,pending_balance,lifetime_earnings,lifetime_withdrawals,created_at,updated_at",
      )
      .order("updated_at", {
        ascending: false,
      }),

    supabase
      .from("wallet_transactions")
      .select(
        "id,wallet_id,type,amount,description,reference,created_at",
      )
      .order("created_at", {
        ascending: false,
      }),

    supabase
      .from("profiles")
      .select(
        "id,username,full_name,avatar_url",
      ),
  ]);

  if (walletsResult.error) {
    throw new Error(
      `No se pudieron cargar las wallets: ${walletsResult.error.message}`,
    );
  }

  if (transactionsResult.error) {
    throw new Error(
      `No se pudieron cargar las transacciones: ${transactionsResult.error.message}`,
    );
  }

  if (profilesResult.error) {
    throw new Error(
      `No se pudieron cargar los perfiles de Wallet: ${profilesResult.error.message}`,
    );
  }

  return {
    wallets:
      (walletsResult.data ?? []) as AdminWalletRow[],
    transactions:
      (transactionsResult.data ?? []) as AdminWalletTransactionRow[],
    profiles:
      (profilesResult.data ?? []) as AdminWalletProfileRow[],
  };
}
import { supabase } from "@/lib/supabase";

export type CreateWithdrawInput = {
  userId: string;
  amount: number;
  currency?: string;
  paymentMethod?: string;
  paymentAccount?: string;
};

export async function createWithdrawRequest(
  input: CreateWithdrawInput,
) {

  return await supabase
    .from("withdraw_requests")
    .insert({
      user_id: input.userId,
      amount: input.amount,
      currency:
        input.currency ?? "USD",
      payment_method:
        input.paymentMethod ?? null,
      payment_account:
        input.paymentAccount ?? null,
      status: "pending",
    })
    .select()
    .single();

}

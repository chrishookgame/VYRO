import { supabase } from "@/lib/supabase";

export async function getWithdrawRequests() {

  return await supabase
    .from("withdraw_requests")
    .select(`
      id,
      user_id,
      amount,
      status,
      created_at
    `)
    .order(
      "created_at",
      {
        ascending: false,
      },
    );

}

export async function approveWithdraw(
  id: string,
) {

  return await supabase
    .from("withdraw_requests")
    .update({
      status: "approved",
      approved_at:
        new Date().toISOString(),
    })
    .eq("id", id);

}

export async function rejectWithdraw(
  id: string,
) {

  return await supabase
    .from("withdraw_requests")
    .update({
      status: "rejected",
      rejected_at:
        new Date().toISOString(),
    })
    .eq("id", id);

}

export async function markWithdrawPaid(
  id: string,
) {

  return await supabase
    .from("withdraw_requests")
    .update({
      status: "paid",
      paid_at:
        new Date().toISOString(),
    })
    .eq("id", id);

}

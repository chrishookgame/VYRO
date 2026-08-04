import { supabase } from "@/lib/supabase";

export async function getMemberById(
  memberId: string,
) {
  return await supabase
    .from("member_cards")
    .select("*")
    .eq("member_id", memberId)
    .single();
}

import { supabase } from "@/lib/supabase";

export async function getAdminUsers() {

  return await supabase
    .from("profiles")
    .select(`
      id,
      username,
      full_name,
      avatar_url,
      verified,
      created_at
    `)
    .order(
      "created_at",
      {
        ascending: false,
      },
    );

}

export async function getAdminUser(
  id: string,
) {

  return await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

}

export async function setAdminUserVerified(
  id: string,
  verified: boolean,
) {

  return await supabase.rpc(
    "admin_set_user_verified",
    {
      p_user_id: id,
      p_verified: verified,
    },
  );

}
export async function deleteAdminUser(
  id: string,
) {

  return await supabase
    .from("profiles")
    .delete()
    .eq("id", id);

}

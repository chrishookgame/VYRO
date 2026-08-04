import { supabase } from "@/lib/supabase";

export async function getPlatformSetting(
  key: string,
) {

  return await supabase
    .from("platform_settings")
    .select("*")
    .eq("key", key)
    .single();

}

export async function updatePlatformSetting(
  key: string,
  value: unknown,
  adminId: string,
) {

  return await supabase
    .from("platform_settings")
    .upsert({
      key,
      value,
      updated_by: adminId,
      updated_at:
        new Date().toISOString(),
    });

}

export async function getAllPlatformSettings() {

  return await supabase
    .from("platform_settings")
    .select("*")
    .order("key");

}

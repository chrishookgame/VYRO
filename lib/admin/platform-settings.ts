import { supabase } from "@/lib/supabase";

export const platformSettingKeys = [
  "liveCommission",
  "marketplaceCommission",
  "referralBonus",
  "academyReward",
  "minimumWithdraw",
] as const;

export type PlatformSettingKey =
  (typeof platformSettingKeys)[number];

export type PlatformSettingRow = {
  key: PlatformSettingKey;
  value: number;
  updated_by: string | null;
  updated_at: string | null;
};

export async function getPlatformSetting(
  key: PlatformSettingKey,
) {
  return await supabase
    .from("platform_settings")
    .select(
      "key, value, updated_by, updated_at",
    )
    .eq("key", key)
    .single();
}

export async function updatePlatformSetting(
  key: PlatformSettingKey,
  value: number,
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
    })
    .select(
      "key, value, updated_by, updated_at",
    )
    .single();
}

export async function getAllPlatformSettings() {
  return await supabase
    .from("platform_settings")
    .select(
      "key, value, updated_by, updated_at",
    )
    .order("key");
}

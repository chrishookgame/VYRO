import { supabase } from "@/lib/supabase";

export type AdminAuditAction =
  | "approve_withdraw"
  | "reject_withdraw"
  | "pay_withdraw"
  | "update_settings"
  | "block_user"
  | "suspend_user"
  | "delete_user"
  | "verify_user"
  | "restore_user";

export async function createAdminAuditLog(
  adminId: string,
  action: AdminAuditAction,
  targetId: string,
  details: string,
) {

  return await supabase
    .from("admin_audit_logs")
    .insert({
      admin_id: adminId,
      action,
      target_id: targetId,
      details,
      created_at:
        new Date().toISOString(),
    });

}

export async function getAdminAuditLogs() {

  return await supabase
    .from("admin_audit_logs")
    .select("*")
    .order(
      "created_at",
      {
        ascending: false,
      },
    );

}

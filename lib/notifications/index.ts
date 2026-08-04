import { supabase } from "@/lib/supabase";

export type NotificationType =
  | "withdraw"
  | "wallet"
  | "reward"
  | "xp"
  | "academy"
  | "member"
  | "live"
  | "marketplace"
  | "admin";

export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: NotificationType,
) {

  return await supabase
    .from("notifications")
    .insert({
      user_id: userId,
      title,
      message,
      type,
      read: false,
      created_at:
        new Date().toISOString(),
    });

}

export async function getNotifications(
  userId: string,
) {

  return await supabase
    .from("notifications")
    .select("*")
    .eq(
      "user_id",
      userId,
    )
    .order(
      "created_at",
      {
        ascending: false,
      },
    );

}

export async function markNotificationRead(
  id: string,
) {

  return await supabase
    .from("notifications")
    .update({
      read: true,
    })
    .eq(
      "id",
      id,
    );

}

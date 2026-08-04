import { supabase } from "@/lib/supabase";
import { Notification } from "./types";

export async function getNotifications(userId: string) {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as Notification[];
}

export async function markAsRead(id: string) {
  const { error } = await supabase
    .from("notifications")
    .update({
      read_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
}

export async function markAllAsRead(userId: string) {
  const { error } = await supabase
    .from("notifications")
    .update({
      read_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .is("read_at", null);

  if (error) throw error;
}

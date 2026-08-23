import { supabase } from "@/lib/supabase";

export async function createTicket(data: {
  user_id: string;
  subject: string;
  category: string;
  priority?: string;
}) {
  return await supabase
    .from("support_tickets")
    .insert(data)
    .select()
    .single();
}

export async function getTickets() {
  return await supabase
    .from("support_tickets")
    .select("*")
    .order("created_at", {
      ascending: false,
    });
}

export async function getOwnTickets(
  userId: string,
) {
  return await supabase
    .from("support_tickets")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", {
      ascending: false,
    });
}

export async function getSupportUserProfiles(
  userIds: string[],
) {
  const uniqueUserIds =
    [...new Set(userIds)].filter(Boolean);

  if (uniqueUserIds.length === 0) {
    return {
      data: [],
      error: null,
    };
  }

  return await supabase
    .from("profiles")
    .select(
      "id, username, full_name",
    )
    .in(
      "id",
      uniqueUserIds,
    );
}

export async function getTicketMessages(
  ticketId: string,
) {
  return await supabase
    .from("support_messages")
    .select("*")
    .eq("ticket_id", ticketId)
    .order("created_at");
}

export async function sendMessage(data: {
  ticket_id: string;
  sender_id: string;
  message: string;
}) {
  return await supabase
    .from("support_messages")
    .insert(data);
}

export * from "./realtime";

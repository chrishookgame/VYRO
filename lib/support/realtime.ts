import { supabase } from "@/lib/supabase";

export function subscribeToSupportMessages(
  ticketId: string,
  onMessage: (payload: unknown) => void,
) {
  return supabase
    .channel(`support-${ticketId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "support_messages",
        filter: `ticket_id=eq.${ticketId}`,
      },
      onMessage,
    )
    .subscribe();
}

export function unsubscribeSupportChannel(
  channel: ReturnType<typeof supabase.channel>,
) {
  return supabase.removeChannel(channel);
}

import { supabase } from "@/lib/supabase";

export type LiveRealtimeEventType =
  | "counter"
  | "reaction"
  | "gift"
  | "ranking"
  | "event";

export interface LiveRealtimeUpdate {
  type: LiveRealtimeEventType;
  payload: unknown;
}

export function subscribeToLiveRoom(
  roomId: string,
  onUpdate: (update: LiveRealtimeUpdate) => void,
  onStatus?: (connected: boolean) => void,
) {
  const channel = supabase
    .channel(`vyro-live:${roomId}`)

    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "live_room_counters",
        filter: `room_id=eq.${roomId}`,
      },
      (payload) => {
        onUpdate({
          type: "counter",
          payload,
        });
      },
    )

    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "live_reactions",
        filter: `room_id=eq.${roomId}`,
      },
      (payload) => {

        onUpdate({
          type: "reaction",
          payload,
        });
      },
    )

    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "live_gifts",
        filter: `room_id=eq.${roomId}`,
      },
      (payload) => {
        onUpdate({
          type: "gift",
          payload,
        });
      },
    )

    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "live_ranking_scores",
        filter: `room_id=eq.${roomId}`,
      },
      (payload) => {
        onUpdate({
          type: "ranking",
          payload,
        });
      },
    )

    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "live_realtime_events",
        filter: `room_id=eq.${roomId}`,
      },
      (payload) => {
        onUpdate({
          type: "event",
          payload,
        });
      },
    )


    .subscribe((status) => {
      onStatus?.(
        status === "SUBSCRIBED",
      );
    });

  return channel;
}

export function unsubscribeFromLiveRoom(
  channel: ReturnType<typeof supabase.channel>,
) {
  return supabase.removeChannel(channel);
}

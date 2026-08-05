import { supabase } from "@/lib/supabase";

export interface LiveGlobalPulse {
  activeRooms: number;
  scheduledRooms: number;
  activeViewers: number;
  totalReactions: number;
  totalGifts: number;
  updatedAt: string;
}

interface LiveRoomStatusRow {
  status: string;
}

interface LiveCounterRow {
  active_viewers: number;
  total_reactions: number;
  total_gifts: number;
}

export async function getLiveGlobalPulse(): Promise<LiveGlobalPulse> {
  const [
    roomsResult,
    countersResult,
  ] = await Promise.all([
    supabase
      .from("live_rooms")
      .select("status")
      .in("status", [
        "live",
        "active",
        "scheduled",
      ]),

    supabase
      .from("live_room_counters")
      .select(
        "active_viewers,total_reactions,total_gifts",
      ),
  ]);

  if (roomsResult.error) {
    throw new Error(
      `No se pudo cargar el estado global LIVE: ${roomsResult.error.message}`,
    );
  }

  if (countersResult.error) {
    throw new Error(
      `No se pudo cargar la actividad global LIVE: ${countersResult.error.message}`,
    );
  }

  const rooms =
    (roomsResult.data ?? []) as unknown as LiveRoomStatusRow[];

  const counters =
    (countersResult.data ?? []) as unknown as LiveCounterRow[];

  const activeRooms = rooms.filter(
    (room) =>
      room.status === "live" ||
      room.status === "active",
  ).length;

  const scheduledRooms = rooms.filter(
    (room) => room.status === "scheduled",
  ).length;

  return {
    activeRooms,
    scheduledRooms,
    activeViewers: counters.reduce(
      (total, counter) =>
        total + counter.active_viewers,
      0,
    ),
    totalReactions: counters.reduce(
      (total, counter) =>
        total + counter.total_reactions,
      0,
    ),
    totalGifts: counters.reduce(
      (total, counter) =>
        total + counter.total_gifts,
      0,
    ),
    updatedAt: new Date().toISOString(),
  };
}

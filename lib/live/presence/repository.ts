import { supabase } from "@/lib/supabase";

import type {
  LivePresenceCounterResult,
  LivePresenceCounterRow,
} from "./types";

function mapPresenceCounter(
  row: LivePresenceCounterRow,
): LivePresenceCounterResult {
  return {
    roomId: row.room_id,
    activeViewers: row.active_viewers,
    peakViewers: row.peak_viewers,
    totalJoins: row.total_joins,
  };
}

export async function joinLiveRoom(
  roomId: string,
): Promise<LivePresenceCounterResult | null> {
  if (!roomId) {
    throw new Error(
      "No existe una sala LIVE para registrar la entrada.",
    );
  }

  const { data, error } = await supabase.rpc(
    "join_live_room",
    {
      target_room_id: roomId,
    },
  );

  if (error) {
    throw new Error(
      `No se pudo registrar la entrada al LIVE: ${error.message}`,
    );
  }

  const row =
    (
      data ?? []
    )[0] as LivePresenceCounterRow | undefined;

  return row
    ? mapPresenceCounter(row)
    : null;
}

export async function leaveLiveRoom(
  roomId: string,
): Promise<LivePresenceCounterResult | null> {
  if (!roomId) {
    return null;
  }

  const { data, error } = await supabase.rpc(
    "leave_live_room",
    {
      target_room_id: roomId,
    },
  );

  if (error) {
    throw new Error(
      `No se pudo registrar la salida del LIVE: ${error.message}`,
    );
  }

  const row =
    (
      data ?? []
    )[0] as LivePresenceCounterRow | undefined;

  return row
    ? mapPresenceCounter(row)
    : null;
}

import { supabase } from "@/lib/supabase";

import {
  parseVyroPresentationState,
  type VyroLivePresentationState,
} from "@/lib/live/presentation/protocol";

export interface LiveRoomDetails {
  id: string;
  hostId: string;
  title: string;
  description: string | null;
  status: string;
  startedAt: string | null;
  endedAt: string | null;
  createdAt: string;
  presentationState:
    VyroLivePresentationState | null;
  host: {
    username: string;
    fullName: string | null;
    avatarUrl: string | null;
    verified: boolean;
  } | null;
  counters: {
    activeViewers: number;
    peakViewers: number;
    totalJoins: number;
    totalReactions: number;
    totalGifts: number;
  };
}

interface LiveRoomRow {
  id: string;
  host_id: string;
  title: string;
  description: string | null;
  status: string;
  started_at: string | null;
  ended_at: string | null;
  created_at: string;
  presentation_state: unknown;
}

interface ProfileRow {
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  verified: boolean;
}

interface LiveRoomCounterRow {
  active_viewers: number;
  peak_viewers: number;
  total_joins: number;
  total_reactions: number;
  total_gifts: number;
}

export async function getLiveRoomDetails(
  roomId: string,
): Promise<LiveRoomDetails | null> {
  const {
    data: roomData,
    error: roomError,
  } = await supabase
    .from("live_rooms")
    .select(
      [
        "id",
        "host_id",
        "title",
        "description",
        "status",
        "started_at",
        "ended_at",
        "created_at",
        "presentation_state",
      ].join(","),
    )
    .eq("id", roomId)
    .maybeSingle();

  if (roomError) {
    throw new Error(
      `No se pudo cargar la sala LIVE: ${roomError.message}`,
    );
  }

  if (!roomData) {
    return null;
  }

  const room =
    roomData as unknown as LiveRoomRow;

  const [
    profileResult,
    counterResult,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "username,full_name,avatar_url,verified",
      )
      .eq("id", room.host_id)
      .maybeSingle(),

    supabase
      .from("live_room_counters")
      .select(
        [
          "active_viewers",
          "peak_viewers",
          "total_joins",
          "total_reactions",
          "total_gifts",
        ].join(","),
      )
      .eq("room_id", room.id)
      .maybeSingle(),
  ]);

  if (counterResult.error) {
    throw new Error(
      `No se pudieron cargar los contadores LIVE: ${counterResult.error.message}`,
    );
  }

  const profile = profileResult.data
    ? (
        profileResult.data as unknown as ProfileRow
      )
    : null;

  const counters = counterResult.data
    ? (
        counterResult.data as unknown as LiveRoomCounterRow
      )
    : null;

  return {
    id: room.id,
    hostId: room.host_id,
    title: room.title,
    description: room.description,
    status: room.status,
    startedAt: room.started_at,
    endedAt: room.ended_at,
    createdAt: room.created_at,
    presentationState:
      parseVyroPresentationState(
        room.presentation_state,
      ),
    host: profile
      ? {
          username: profile.username,
          fullName: profile.full_name,
          avatarUrl: profile.avatar_url,
          verified: profile.verified,
        }
      : null,
    counters: {
      activeViewers:
        counters?.active_viewers ?? 0,
      peakViewers:
        counters?.peak_viewers ?? 0,
      totalJoins:
        counters?.total_joins ?? 0,
      totalReactions:
        counters?.total_reactions ?? 0,
      totalGifts:
        counters?.total_gifts ?? 0,
    },
  };
}

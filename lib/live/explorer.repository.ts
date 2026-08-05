import { supabase } from "@/lib/supabase";

export interface LiveExplorerRoom {
  id: string;
  title: string;
  description: string | null;
  status: string;
  startedAt: string | null;
  createdAt: string;
  host: {
    username: string;
    fullName: string | null;
    avatarUrl: string | null;
    verified: boolean;
  } | null;
  counters: {
    activeViewers: number;
    peakViewers: number;
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
  created_at: string;
}

interface ProfileRow {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  verified: boolean;
}

interface CounterRow {
  room_id: string;
  active_viewers: number;
  peak_viewers: number;
  total_reactions: number;
  total_gifts: number;
}

export async function getLiveExplorerRooms(
  limit = 24,
): Promise<LiveExplorerRoom[]> {
  const { data: roomsData, error: roomsError } =
    await supabase
      .from("live_rooms")
      .select(
        [
          "id",
          "host_id",
          "title",
          "description",
          "status",
          "started_at",
          "created_at",
        ].join(","),
      )
      .in("status", [
        "live",
        "scheduled",
        "active",
      ])
      .order("started_at", {
        ascending: false,
        nullsFirst: false,
      })
      .limit(limit);

  if (roomsError) {
    throw new Error(
      `No se pudieron cargar las salas LIVE: ${roomsError.message}`,
    );
  }

  const rooms =
    (roomsData ?? []) as unknown as LiveRoomRow[];

  if (rooms.length === 0) {
    return [];
  }

  const roomIds = rooms.map((room) => room.id);
  const hostIds = [
    ...new Set(
      rooms.map((room) => room.host_id),
    ),
  ];

  const [
    profilesResult,
    countersResult,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "id,username,full_name,avatar_url,verified",
      )
      .in("id", hostIds),

    supabase
      .from("live_room_counters")
      .select(
        [
          "room_id",
          "active_viewers",
          "peak_viewers",
          "total_reactions",
          "total_gifts",
        ].join(","),
      )
      .in("room_id", roomIds),
  ]);

  if (profilesResult.error) {
    throw new Error(
      `No se pudieron cargar los creadores LIVE: ${profilesResult.error.message}`,
    );
  }

  if (countersResult.error) {
    throw new Error(
      `No se pudieron cargar los contadores LIVE: ${countersResult.error.message}`,
    );
  }

  const profiles =
    (profilesResult.data ?? []) as unknown as ProfileRow[];

  const counters =
    (countersResult.data ?? []) as unknown as CounterRow[];

  const profileMap = new Map(
    profiles.map((profile) => [
      profile.id,
      profile,
    ]),
  );

  const counterMap = new Map(
    counters.map((counter) => [
      counter.room_id,
      counter,
    ]),
  );

  return rooms.map((room) => {
    const profile =
      profileMap.get(room.host_id) ?? null;

    const counter =
      counterMap.get(room.id) ?? null;

    return {
      id: room.id,
      title: room.title,
      description: room.description,
      status: room.status,
      startedAt: room.started_at,
      createdAt: room.created_at,
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
          counter?.active_viewers ?? 0,
        peakViewers:
          counter?.peak_viewers ?? 0,
        totalReactions:
          counter?.total_reactions ?? 0,
        totalGifts:
          counter?.total_gifts ?? 0,
      },
    };
  });
}

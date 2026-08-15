import { supabase } from "@/lib/supabase";

import type {
  LiveChatMessage,
  LiveChatMessageRow,
  LiveChatProfileRow,
} from "./types";

function mapMessage(
  row: LiveChatMessageRow,
  profile: LiveChatProfileRow | null,
): LiveChatMessage {
  return {
    id: row.id,
    roomId: row.room_id,
    userId: row.user_id,
    message: row.message,
    createdAt: row.created_at,
    profile: profile
      ? {
          username: profile.username,
          fullName: profile.full_name,
          avatarUrl: profile.avatar_url,
          verified: profile.verified,
        }
      : null,
  };
}

export async function getLiveChatMessages(
  roomId: string,
  limit = 100,
): Promise<LiveChatMessage[]> {
  const { data: messageData, error: messageError } =
    await supabase
      .from("live_messages")
      .select(
        "id,room_id,user_id,message,created_at",
      )
      .eq("room_id", roomId)
      .order("created_at", {
        ascending: true,
      })
      .limit(limit);

  if (messageError) {
    throw new Error(
      `No se pudieron cargar los mensajes LIVE: ${messageError.message}`,
    );
  }

  const rows =
    (messageData ?? []) as unknown as LiveChatMessageRow[];

  if (rows.length === 0) {
    return [];
  }

  const userIds = [
    ...new Set(
      rows.map((row) => row.user_id),
    ),
  ];

  const { data: profileData, error: profileError } =
    await supabase
      .from("profiles")
      .select(
        "id,username,full_name,avatar_url,verified",
      )
      .in("id", userIds);

  if (profileError) {
    console.warn(
      "VYRO LIVE chat profile enrichment failed:",
      {
        roomId,
        message: profileError.message,
      },
    );

    return rows.map((row) =>
      mapMessage(row, null),
    );
  }

  const profiles =
    (profileData ?? []) as unknown as LiveChatProfileRow[];

  const profileMap = new Map(
    profiles.map((profile) => [
      profile.id,
      profile,
    ]),
  );

  return rows.map((row) =>
    mapMessage(
      row,
      profileMap.get(row.user_id) ?? null,
    ),
  );
}

export async function sendLiveChatMessageRecord(
  roomId: string,
  userId: string,
  message: string,
): Promise<LiveChatMessage> {
  const { data, error } = await supabase
    .from("live_messages")
    .insert({
      room_id: roomId,
      user_id: userId,
      message,
    })
    .select(
      "id,room_id,user_id,message,created_at",
    )
    .single();

  if (error) {
    throw new Error(
      `No se pudo enviar el mensaje LIVE: ${error.message}`,
    );
  }

  const row =
    data as unknown as LiveChatMessageRow;

  const { data: profileData } = await supabase
    .from("profiles")
    .select(
      "id,username,full_name,avatar_url,verified",
    )
    .eq("id", userId)
    .maybeSingle();

  return mapMessage(
    row,
    profileData
      ? (
          profileData as unknown as LiveChatProfileRow
        )
      : null,
  );
}

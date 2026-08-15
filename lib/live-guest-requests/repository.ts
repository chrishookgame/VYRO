import { supabase } from "@/lib/supabase";

import type {
  CreateLiveGuestRequestInput,
  LiveGuestRequest,
  LiveGuestRequestStatus,
} from "./types";

type LiveGuestRequestProfileRow = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
};
type LiveGuestRequestRow = {
  id: string;
  room_id: string;
  requester_id: string;
  status: LiveGuestRequestStatus;
  message: string | null;
  resolved_by: string | null;
  invitation_id: string | null;
  expires_at: string;
  resolved_at: string | null;
  cancelled_at: string | null;
  expired_at: string | null;
  created_at: string;
  updated_at: string;
};

const REQUEST_COLUMNS = [
  "id",
  "room_id",
  "requester_id",
  "status",
  "message",
  "resolved_by",
  "invitation_id",
  "expires_at",
  "resolved_at",
  "cancelled_at",
  "expired_at",
  "created_at",
  "updated_at",
].join(",");

function mapLiveGuestRequest(
  row: LiveGuestRequestRow,
  profile: LiveGuestRequestProfileRow | null = null,
): LiveGuestRequest {
  return {
    id: row.id,
    roomId: row.room_id,
    requesterId: row.requester_id,
    requesterUsername: profile?.username ?? null,
    requesterFullName: profile?.full_name ?? null,
    requesterAvatarUrl: profile?.avatar_url ?? null,
    status: row.status,
    message: row.message,
    resolvedBy: row.resolved_by,
    invitationId: row.invitation_id,
    expiresAt: row.expires_at,
    resolvedAt: row.resolved_at,
    cancelledAt: row.cancelled_at,
    expiredAt: row.expired_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapRpcRequest(
  data: unknown,
): LiveGuestRequest {
  if (!data || typeof data !== "object") {
    throw new Error(
      "Supabase no devolvio una solicitud Guest valida.",
    );
  }

  return mapLiveGuestRequest(
    data as LiveGuestRequestRow,
  );
}

export async function getLiveGuestRequestsForRoom(
  roomId: string,
): Promise<LiveGuestRequest[]> {
  const {
    data,
    error,
  } = await supabase
    .from("live_guest_requests")
    .select(REQUEST_COLUMNS)
    .eq("room_id", roomId)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  const rows =
    (data ?? []) as unknown as LiveGuestRequestRow[];

  if (rows.length === 0) {
    return [];
  }

  const requesterIds = [
    ...new Set(
      rows.map((row) => row.requester_id),
    ),
  ];

  const {
    data: profileData,
    error: profileError,
  } = await supabase
    .from("profiles")
    .select(
      "id,username,full_name,avatar_url",
    )
    .in("id", requesterIds);

  if (profileError) {
    console.warn(
      "VYRO Guest Request profile enrichment failed:",
      {
        roomId,
        message: profileError.message,
      },
    );

    return rows.map((row) =>
      mapLiveGuestRequest(row),
    );
  }

  const profiles =
    (profileData ?? []) as unknown as LiveGuestRequestProfileRow[];

  const profileMap = new Map(
    profiles.map((profile) => [
      profile.id,
      profile,
    ]),
  );

  return rows.map((row) =>
    mapLiveGuestRequest(
      row,
      profileMap.get(row.requester_id) ?? null,
    ),
  );
}

export async function requestLiveGuestAccess(
  input: CreateLiveGuestRequestInput,
): Promise<LiveGuestRequest> {
  const {
    data,
    error,
  } = await supabase.rpc(
    "request_live_guest_access",
    {
      target_room_id: input.roomId,
      request_message:
        input.message?.trim() || null,
    },
  );

  if (error) {
    throw error;
  }

  return mapRpcRequest(data);
}

export async function cancelLiveGuestRequest(
  requestId: string,
): Promise<LiveGuestRequest> {
  const {
    data,
    error,
  } = await supabase.rpc(
    "cancel_live_guest_request",
    {
      target_request_id: requestId,
    },
  );

  if (error) {
    throw error;
  }

  return mapRpcRequest(data);
}

export async function approveLiveGuestRequest(
  requestId: string,
): Promise<LiveGuestRequest> {
  const {
    data,
    error,
  } = await supabase.rpc(
    "approve_live_guest_request",
    {
      target_request_id: requestId,
    },
  );

  if (error) {
    throw error;
  }

  return mapRpcRequest(data);
}

export async function declineLiveGuestRequest(
  requestId: string,
): Promise<LiveGuestRequest> {
  const {
    data,
    error,
  } = await supabase.rpc(
    "decline_live_guest_request",
    {
      target_request_id: requestId,
    },
  );

  if (error) {
    throw error;
  }

  return mapRpcRequest(data);
}
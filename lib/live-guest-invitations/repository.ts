import { supabase } from "@/lib/supabase";

import type {
  CreateLiveGuestInvitationInput,
  LiveGuestInvitation,
  LiveGuestInvitationProfile,
  LiveGuestInvitationRow,
  LiveGuestInvitationStatus,
  LiveGuestPermissions,
} from "./types";

const DEFAULT_PERMISSIONS: LiveGuestPermissions = {
  canPublishCamera: true,
  canPublishMicrophone: true,
  canShareScreen: false,
};

function getEffectiveStatus(
  invitation: LiveGuestInvitationRow,
): LiveGuestInvitationStatus {
  if (
    invitation.status === "pending" &&
    new Date(invitation.expires_at).getTime() <= Date.now()
  ) {
    return "expired";
  }

  return invitation.status;
}

async function getProfile(
  userId: string,
): Promise<LiveGuestInvitationProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, username, avatar_url")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(
      `No se pudo cargar el perfil Guest: ${error.message}`,
    );
  }

  return data as LiveGuestInvitationProfile | null;
}

async function mapInvitation(
  row: LiveGuestInvitationRow,
): Promise<LiveGuestInvitation> {
  const [inviter, guest] = await Promise.all([
    getProfile(row.inviter_id),
    getProfile(row.guest_id),
  ]);

  return {
    id: row.id,
    roomId: row.room_id,
    inviterId: row.inviter_id,
    guestId: row.guest_id,
    status: getEffectiveStatus(row),
    stageStatus:
      row.stage_status ?? "waiting",
    message: row.message,
    permissions: row.permissions,
    expiresAt: row.expires_at,
    respondedAt: row.responded_at,
    acceptedAt: row.accepted_at,
    declinedAt: row.declined_at,
    cancelledAt: row.cancelled_at,
    revokedAt: row.revoked_at,
    stagedAt:
      row.staged_at ?? null,
    unstagedAt:
      row.unstaged_at ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    inviter,
    guest,
  };
}

async function requireCurrentUserId(): Promise<string> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(
      `No se pudo identificar al usuario: ${error.message}`,
    );
  }

  if (!user) {
    throw new Error(
      "Debes iniciar sesión para gestionar invitados del LIVE.",
    );
  }

  return user.id;
}

export async function createLiveGuestInvitation(
  input: CreateLiveGuestInvitationInput,
): Promise<LiveGuestInvitation> {
  const inviterId = await requireCurrentUserId();

  const expiresInSeconds = Math.max(
    30,
    Math.floor(input.expiresInSeconds ?? 300),
  );

  const expiresAt = new Date(
    Date.now() + expiresInSeconds * 1000,
  ).toISOString();

  const permissions: LiveGuestPermissions = {
    ...DEFAULT_PERMISSIONS,
    ...input.permissions,
  };

  const { data, error } = await supabase
    .from("live_guest_invitations")
    .insert({
      room_id: input.roomId,
      inviter_id: inviterId,
      guest_id: input.guestId,
      status: "pending",
      message: input.message?.trim() || null,
      permissions,
      expires_at: expiresAt,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(
      `No se pudo enviar la invitación Guest: ${error.message}`,
    );
  }

  return mapInvitation(
    data as LiveGuestInvitationRow,
  );
}

export async function getReceivedLiveGuestInvitations(): Promise<
  LiveGuestInvitation[]
> {
  const userId = await requireCurrentUserId();

  const { data, error } = await supabase
    .from("live_guest_invitations")
    .select("*")
    .eq("guest_id", userId)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(
      `No se pudieron cargar las invitaciones Guest recibidas: ${error.message}`,
    );
  }

  return Promise.all(
    (data as LiveGuestInvitationRow[]).map(
      mapInvitation,
    ),
  );
}

export async function getSentLiveGuestInvitations(): Promise<
  LiveGuestInvitation[]
> {
  const userId = await requireCurrentUserId();

  const { data, error } = await supabase
    .from("live_guest_invitations")
    .select("*")
    .eq("inviter_id", userId)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(
      `No se pudieron cargar las invitaciones Guest enviadas: ${error.message}`,
    );
  }

  return Promise.all(
    (data as LiveGuestInvitationRow[]).map(
      mapInvitation,
    ),
  );
}

async function updatePendingInvitation(
  invitationId: string,
  status: "accepted" | "declined" | "cancelled",
): Promise<LiveGuestInvitation> {
  const now = new Date().toISOString();

  const values: Record<string, string> = {
    status,
    responded_at: now,
  };

  if (status === "accepted") {
    values.accepted_at = now;
  }

  if (status === "declined") {
    values.declined_at = now;
  }

  if (status === "cancelled") {
    values.cancelled_at = now;
  }

  const { data, error } = await supabase
    .from("live_guest_invitations")
    .update(values)
    .eq("id", invitationId)
    .eq("status", "pending")
    .select("*")
    .single();

  if (error) {
    throw new Error(
      `No se pudo actualizar la invitación Guest: ${error.message}`,
    );
  }

  return mapInvitation(
    data as LiveGuestInvitationRow,
  );
}

export function acceptLiveGuestInvitation(
  invitationId: string,
): Promise<LiveGuestInvitation> {
  return updatePendingInvitation(
    invitationId,
    "accepted",
  );
}

export function declineLiveGuestInvitation(
  invitationId: string,
): Promise<LiveGuestInvitation> {
  return updatePendingInvitation(
    invitationId,
    "declined",
  );
}

export function cancelLiveGuestInvitation(
  invitationId: string,
): Promise<LiveGuestInvitation> {
  return updatePendingInvitation(
    invitationId,
    "cancelled",
  );
}

export async function revokeLiveGuestInvitation(
  invitationId: string,
): Promise<LiveGuestInvitation> {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("live_guest_invitations")
    .update({
      status: "revoked",
      revoked_at: now,
    })
    .eq("id", invitationId)
    .eq("status", "accepted")
    .select("*")
    .single();

  if (error) {
    throw new Error(
      `No se pudo revocar el acceso Guest: ${error.message}`,
    );
  }

  return mapInvitation(
    data as LiveGuestInvitationRow,
  );
}
export async function putLiveGuestOnStage(
  invitationId: string,
): Promise<LiveGuestInvitation> {
  const { data, error } =
    await supabase.rpc(
      "put_live_guest_on_stage",
      {
        target_invitation_id:
          invitationId,
      },
    );

  if (error) {
    throw new Error(
      `No se pudo subir el Guest al Stage: ${error.message}`,
    );
  }

  if (!data) {
    throw new Error(
      "VYRO no recibió el Guest actualizado.",
    );
  }

  return mapInvitation(
    data as LiveGuestInvitationRow,
  );
}

export async function returnLiveGuestToWaiting(
  invitationId: string,
): Promise<LiveGuestInvitation> {
  const { data, error } =
    await supabase.rpc(
      "return_live_guest_to_waiting",
      {
        target_invitation_id:
          invitationId,
      },
    );

  if (error) {
    throw new Error(
      `No se pudo bajar el Guest del Stage: ${error.message}`,
    );
  }

  if (!data) {
    throw new Error(
      "VYRO no recibió el Guest actualizado.",
    );
  }

  return mapInvitation(
    data as LiveGuestInvitationRow,
  );
}

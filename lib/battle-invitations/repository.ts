import { supabase } from "@/lib/supabase";

import type {
  BattleInvitation,
  BattleInvitationProfile,
  BattleInvitationRow,
  BattleInvitationStatus,
  CreateBattleInvitationInput,
} from "./types";

function getEffectiveStatus(
  invitation: BattleInvitationRow,
): BattleInvitationStatus {
  if (
    invitation.status === "pending" &&
    new Date(
      invitation.expires_at,
    ).getTime() <= Date.now()
  ) {
    return "expired";
  }

  return invitation.status;
}

async function getProfile(
  userId: string,
): Promise<BattleInvitationProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, full_name, username, avatar_url",
    )
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(
      `No se pudo cargar el perfil de la invitación: ${error.message}`,
    );
  }

  return data as BattleInvitationProfile | null;
}

async function mapInvitation(
  row: BattleInvitationRow,
): Promise<BattleInvitation> {
  const [
    sender,
    receiver,
  ] = await Promise.all([
    getProfile(row.sender_id),
    getProfile(row.receiver_id),
  ]);

  return {
    id: row.id,
    roomId: row.room_id,
    senderId: row.sender_id,
    receiverId: row.receiver_id,
    status: getEffectiveStatus(
      row,
    ),
    seriesConfig:
      row.series_config,
    message: row.message,
    expiresAt: row.expires_at,
    respondedAt:
      row.responded_at,
    acceptedAt:
      row.accepted_at,
    declinedAt:
      row.declined_at,
    cancelledAt:
      row.cancelled_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    sender,
    receiver,
  };
}

async function requireCurrentUserId(): Promise<string> {
  const {
    data: {
      user,
    },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(
      `No se pudo identificar al usuario: ${error.message}`,
    );
  }

  if (!user) {
    throw new Error(
      "Debes iniciar sesión para gestionar invitaciones de batalla.",
    );
  }

  return user.id;
}

export async function createBattleInvitation(
  input: CreateBattleInvitationInput,
): Promise<BattleInvitation> {
  const senderId =
    await requireCurrentUserId();

  const expiresInSeconds =
    Math.max(
      30,
      Math.floor(
        input.expiresInSeconds ??
          120,
      ),
    );

  const expiresAt =
    new Date(
      Date.now() +
        expiresInSeconds *
          1000,
    ).toISOString();

  const { data, error } = await supabase
    .from(
      "live_battle_invitations",
    )
    .insert({
      room_id: input.roomId,
      sender_id: senderId,
      receiver_id:
        input.receiverId,
      status: "pending",
      series_config:
        input.seriesConfig,
      message:
        input.message?.trim() ||
        null,
      expires_at: expiresAt,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(
      `No se pudo enviar la invitación de batalla: ${error.message}`,
    );
  }

  return mapInvitation(
    data as BattleInvitationRow,
  );
}

export async function getReceivedBattleInvitations(): Promise<
  BattleInvitation[]
> {
  const userId =
    await requireCurrentUserId();

  const { data, error } = await supabase
    .from(
      "live_battle_invitations",
    )
    .select("*")
    .eq("receiver_id", userId)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(
      `No se pudieron cargar las invitaciones recibidas: ${error.message}`,
    );
  }

  return Promise.all(
    (
      data as BattleInvitationRow[]
    ).map(mapInvitation),
  );
}

export async function getSentBattleInvitations(): Promise<
  BattleInvitation[]
> {
  const userId =
    await requireCurrentUserId();

  const { data, error } = await supabase
    .from(
      "live_battle_invitations",
    )
    .select("*")
    .eq("sender_id", userId)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(
      `No se pudieron cargar las invitaciones enviadas: ${error.message}`,
    );
  }

  return Promise.all(
    (
      data as BattleInvitationRow[]
    ).map(mapInvitation),
  );
}

async function updateInvitationStatus(
  invitationId: string,
  status:
    | "accepted"
    | "declined"
    | "cancelled",
): Promise<BattleInvitation> {
  const now =
    new Date().toISOString();

  const values: Record<
    string,
    string
  > = {
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
    .from(
      "live_battle_invitations",
    )
    .update(values)
    .eq("id", invitationId)
    .eq("status", "pending")
    .select("*")
    .single();

  if (error) {
    throw new Error(
      `No se pudo actualizar la invitación: ${error.message}`,
    );
  }

  return mapInvitation(
    data as BattleInvitationRow,
  );
}

export function acceptBattleInvitation(
  invitationId: string,
): Promise<BattleInvitation> {
  return updateInvitationStatus(
    invitationId,
    "accepted",
  );
}

export function declineBattleInvitation(
  invitationId: string,
): Promise<BattleInvitation> {
  return updateInvitationStatus(
    invitationId,
    "declined",
  );
}

export function cancelBattleInvitation(
  invitationId: string,
): Promise<BattleInvitation> {
  return updateInvitationStatus(
    invitationId,
    "cancelled",
  );
}

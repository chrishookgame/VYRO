import { supabase } from "@/lib/supabase";

import {
  parseVyroPresentationState,
  type VyroLivePresentationState,
} from "@/lib/live/presentation/protocol";

import type {
  CreateLiveSessionInput,
  LiveSession,
  LiveSessionRow,
} from "./types";

function mapLiveSession(
  row: LiveSessionRow,
): LiveSession {
  return {
    id: row.id,
    hostId: row.host_id,
    title: row.title,
    description: row.description,
    status: row.status,
    streamKey: row.stream_key,
    startedAt: row.started_at,
    endedAt: row.ended_at,
    createdAt: row.created_at,
    presentationState:
      parseVyroPresentationState(
        row.presentation_state,
      ),
  };
}

export async function createLiveSessionRecord(
  hostId: string,
  input: CreateLiveSessionInput,
): Promise<LiveSession> {
  const { data, error } = await supabase
    .from("live_rooms")
    .insert({
      host_id: hostId,
      title: input.title,
      description: input.description ?? null,
      status: "scheduled",
    })
    .select(
      [
        "id",
        "host_id",
        "title",
        "description",
        "status",
        "stream_key",
        "started_at",
        "ended_at",
        "created_at",
        "presentation_state",
      ].join(","),
    )
    .single();

  if (error) {
    throw new Error(
      `No se pudo crear la sesión LIVE: ${error.message}`,
    );
  }

  return mapLiveSession(
    data as unknown as LiveSessionRow,
  );
}

export async function getRecoverableLiveSessionRecord(
  hostId: string,
): Promise<LiveSession | null> {
  const { data, error } = await supabase
    .from("live_rooms")
    .select(
      [
        "id",
        "host_id",
        "title",
        "description",
        "status",
        "stream_key",
        "started_at",
        "ended_at",
        "created_at",
        "presentation_state",
      ].join(","),
    )
    .eq("host_id", hostId)
    .in("status", [
      "scheduled",
      "live",
      "active",
    ])
    .order("created_at", {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(
      `No se pudo recuperar la sesión LIVE: ${error.message}`,
    );
  }

  if (!data) {
    return null;
  }

  return mapLiveSession(
    data as unknown as LiveSessionRow,
  );
}

export async function startLiveSessionRecord(
  roomId: string,
  hostId: string,
): Promise<LiveSession> {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("live_rooms")
    .update({
      status: "live",
      started_at: now,
      ended_at: null,
    })
    .eq("id", roomId)
    .eq("host_id", hostId)
    .select(
      [
        "id",
        "host_id",
        "title",
        "description",
        "status",
        "stream_key",
        "started_at",
        "ended_at",
        "created_at",
        "presentation_state",
      ].join(","),
    )
    .single();

  if (error) {
    throw new Error(
      `No se pudo iniciar la sesión LIVE: ${error.message}`,
    );
  }

  return mapLiveSession(
    data as unknown as LiveSessionRow,
  );
}

export async function endLiveSessionRecord(
  roomId: string,
  hostId: string,
): Promise<LiveSession> {
  const { data, error } = await supabase
    .from("live_rooms")
    .update({
      status: "ended",
      ended_at: new Date().toISOString(),
    })
    .eq("id", roomId)
    .eq("host_id", hostId)
    .select(
      [
        "id",
        "host_id",
        "title",
        "description",
        "status",
        "stream_key",
        "started_at",
        "ended_at",
        "created_at",
        "presentation_state",
      ].join(","),
    )
    .single();

  if (error) {
    throw new Error(
      `No se pudo finalizar la sesión LIVE: ${error.message}`,
    );
  }

  return mapLiveSession(
    data as unknown as LiveSessionRow,
  );
}
export async function updateLivePresentationStateRecord(
  roomId: string,
  hostId: string,
  presentationState: VyroLivePresentationState,
): Promise<void> {
  const { error } = await supabase
    .from("live_rooms")
    .update({
      presentation_state: presentationState,
    })
    .eq("id", roomId)
    .eq("host_id", hostId)
    .select("id")
    .single();

  if (error) {
    throw new Error(
      `No se pudo guardar el estado de presentación LIVE: ${error.message}`,
    );
  }
}

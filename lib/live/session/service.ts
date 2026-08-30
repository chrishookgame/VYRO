import { supabase } from "@/lib/supabase";

import {
  createLiveSessionRecord,
  endLiveSessionRecord,
  getRecoverableLiveSessionRecord,
  startLiveSessionRecord,
  updateLivePresentationStateRecord,
} from "./repository";

import type {
  VyroLivePresentationState,
} from "@/lib/live/presentation/protocol";

import type {
  CreateLiveSessionInput,
  LiveSession,
} from "./types";

async function getAuthenticatedUserId(): Promise<string> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(
      `No se pudo verificar el usuario: ${error.message}`,
    );
  }

  if (!user) {
    throw new Error(
      "Debes iniciar sesión para utilizar VYRO LIVE.",
    );
  }

  return user.id;
}

export async function createLiveSession(
  input: CreateLiveSessionInput,
): Promise<LiveSession> {
  const title = input.title.trim();

  if (!title) {
    throw new Error(
      "El título de la transmisión es obligatorio.",
    );
  }

  const hostId =
    await getAuthenticatedUserId();

  const existingSession =
    await getRecoverableLiveSessionRecord(
      hostId,
    );

  if (existingSession) {
    return existingSession;
  }

  return createLiveSessionRecord(
    hostId,
    {
      title,
      description:
        input.description?.trim() || null,
    },
  );
}

export async function recoverLiveSession():
Promise<LiveSession | null> {
  const hostId =
    await getAuthenticatedUserId();

  return getRecoverableLiveSessionRecord(
    hostId,
  );
}

export async function startLiveSession(
  roomId: string,
): Promise<LiveSession> {
  if (!roomId) {
    throw new Error(
      "No existe una sala LIVE para iniciar.",
    );
  }

  const hostId =
    await getAuthenticatedUserId();

  return startLiveSessionRecord(
    roomId,
    hostId,
  );
}

export async function endLiveSession(
  roomId: string,
): Promise<LiveSession> {
  if (!roomId) {
    throw new Error(
      "No existe una sala LIVE para finalizar.",
    );
  }

  const hostId =
    await getAuthenticatedUserId();

  return endLiveSessionRecord(
    roomId,
    hostId,
  );
}
export async function updateLivePresentationState(
  roomId: string,
  presentationState: VyroLivePresentationState,
): Promise<void> {
  if (!roomId) {
    throw new Error(
      "No existe una sala LIVE para guardar la presentación.",
    );
  }

  const hostId =
    await getAuthenticatedUserId();

  await updateLivePresentationStateRecord(
    roomId,
    hostId,
    presentationState,
  );
}

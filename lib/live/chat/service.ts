import { supabase } from "@/lib/supabase";

import {
  getLiveChatMessages,
  sendLiveChatMessageRecord,
} from "./repository";

import type {
  LiveChatMessage,
} from "./types";

export async function loadLiveChat(
  roomId: string,
): Promise<LiveChatMessage[]> {
  if (!roomId) {
    return [];
  }

  return getLiveChatMessages(roomId);
}

export async function sendLiveChatMessage(
  roomId: string,
  content: string,
): Promise<LiveChatMessage> {
  const message = content.trim();

  if (!roomId) {
    throw new Error(
      "No existe una sala LIVE para enviar el mensaje.",
    );
  }

  if (!message) {
    throw new Error(
      "Escribe un mensaje antes de enviarlo.",
    );
  }

  if (message.length > 500) {
    throw new Error(
      "El mensaje no puede superar 500 caracteres.",
    );
  }

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
      "Debes iniciar sesión para participar en el chat LIVE.",
    );
  }

  return sendLiveChatMessageRecord(
    roomId,
    user.id,
    message,
  );
}

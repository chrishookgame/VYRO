"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  loadLiveChat,
  sendLiveChatMessage,
  type LiveChatMessage,
} from "@/lib/live";
import { supabase } from "@/lib/supabase";

export interface UseLiveChatResult {
  messages: LiveChatMessage[];
  loading: boolean;
  sending: boolean;
  connected: boolean;
  error: string;
  sendMessage: (
    content: string,
  ) => Promise<LiveChatMessage | null>;
  refreshMessages: () => Promise<void>;
  clearError: () => void;
}

export function useLiveChat(
  roomId: string | null | undefined,
): UseLiveChatResult {
  const mountedRef = useRef(true);

  const [messages, setMessages] =
    useState<LiveChatMessage[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [sending, setSending] =
    useState(false);

  const [connected, setConnected] =
    useState(false);

  const [error, setError] =
    useState("");

  const clearError = useCallback(() => {
    setError("");
  }, []);

  const refreshMessages =
    useCallback(async () => {
      if (!roomId) {
        setMessages([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const loadedMessages =
          await loadLiveChat(roomId);

        if (mountedRef.current) {
          setMessages(loadedMessages);
          setError("");
        }
      } catch (chatError) {
        if (mountedRef.current) {
          setError(
            chatError instanceof Error
              ? chatError.message
              : "No se pudo cargar el chat LIVE.",
          );
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    }, [roomId]);

  const sendMessage = useCallback(
    async (
      content: string,
    ): Promise<LiveChatMessage | null> => {
      if (!roomId) {
        setError(
          "No existe una sala LIVE para enviar mensajes.",
        );
        return null;
      }

      setSending(true);
      setError("");

      try {
        const sentMessage =
          await sendLiveChatMessage(
            roomId,
            content,
          );

        setMessages((currentMessages) => {
          const alreadyExists =
            currentMessages.some(
              (message) =>
                message.id === sentMessage.id,
            );

          return alreadyExists
            ? currentMessages
            : [
                ...currentMessages,
                sentMessage,
              ];
        });

        return sentMessage;
      } catch (chatError) {
        setError(
          chatError instanceof Error
            ? chatError.message
            : "No se pudo enviar el mensaje LIVE.",
        );

        return null;
      } finally {
        setSending(false);
      }
    },
    [roomId],
  );

  useEffect(() => {
    mountedRef.current = true;

    void refreshMessages();

    return () => {
      mountedRef.current = false;
    };
  }, [refreshMessages]);

  useEffect(() => {
    if (!roomId) {
      setConnected(false);
      return;
    }

    const channel = supabase
      .channel(
        `vyro-live-chat:${roomId}`,
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "live_messages",
          filter:
            `room_id=eq.${roomId}`,
        },
        () => {
          void refreshMessages();
        },
      )
      .subscribe((status) => {
        setConnected(
          status === "SUBSCRIBED",
        );
      });

    return () => {
      setConnected(false);

      void supabase.removeChannel(
        channel,
      );
    };
  }, [
    refreshMessages,
    roomId,
  ]);

  return {
    messages,
    loading,
    sending,
    connected,
    error,
    sendMessage,
    refreshMessages,
    clearError,
  };
}

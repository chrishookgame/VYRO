"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  MessageCircle,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

type MessageRow = {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: string;
  media_url: string | null;
  read_at: string | null;
  created_at: string;
  updated_at: string;
};

type ChatWindowProps = {
  conversationId: string;
  username: string;
};

export default function ChatWindow({
  conversationId,
  username,
}: ChatWindowProps) {
  const [messages, setMessages] =
    useState<MessageRow[]>([]);

  const [currentUserId, setCurrentUserId] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [sending, setSending] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [error, setError] =
    useState("");

  const bottomRef =
    useRef<HTMLDivElement>(null);

  const scrollToBottom =
    useCallback(() => {
      window.requestAnimationFrame(
        () => {
          bottomRef.current
            ?.scrollIntoView({
              behavior: "smooth",
            });
        },
      );
    }, []);

  const markMessagesRead =
    useCallback(
      async (
        userId: string,
      ) => {
        const {
          error: updateError,
        } = await supabase
          .from("direct_messages")
          .update({
            read_at:
              new Date().toISOString(),
          })
          .eq(
            "conversation_id",
            conversationId,
          )
          .neq(
            "sender_id",
            userId,
          )
          .is(
            "read_at",
            null,
          );

        if (updateError) {
          console.error(
            "VYRO message read error:",
            updateError,
          );
        }
      },
      [conversationId],
    );

  const loadMessages =
    useCallback(async () => {
      setLoading(true);
      setError("");

      const {
        data: { user },
        error: userError,
      } =
        await supabase.auth.getUser();

      if (
        userError ||
        !user
      ) {
        setError(
          "Debes iniciar sesión para ver esta conversación.",
        );

        setLoading(false);
        return;
      }

      setCurrentUserId(
        user.id,
      );

      const {
        data,
        error: messagesError,
      } = await supabase
        .from("direct_messages")
        .select(
          "id, conversation_id, sender_id, content, message_type, media_url, read_at, created_at, updated_at",
        )
        .eq(
          "conversation_id",
          conversationId,
        )
        .order(
          "created_at",
          {
            ascending: true,
          },
        );

      if (messagesError) {
        console.error(
          "VYRO messages load error:",
          messagesError,
        );

        setError(
          messagesError.message,
        );

        setLoading(false);
        return;
      }

      setMessages(
        (data ?? []) as MessageRow[],
      );

      await markMessagesRead(
        user.id,
      );

      setLoading(false);
      scrollToBottom();
    }, [
      conversationId,
      markMessagesRead,
      scrollToBottom,
    ]);

  useEffect(() => {
    void loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    if (!currentUserId) {
      return;
    }

    const channel =
      supabase
        .channel(
          `direct-messages-${conversationId}`,
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table:
              "direct_messages",
            filter:
              `conversation_id=eq.${conversationId}`,
          },
          () => {
            void loadMessages();
          },
        )
        .subscribe();

    return () => {
      void supabase.removeChannel(
        channel,
      );
    };
  }, [
    conversationId,
    currentUserId,
    loadMessages,
  ]);

  async function sendMessage(
    content: string,
  ) {
    if (!currentUserId) {
      setError(
        "Debes iniciar sesión.",
      );

      return false;
    }

    setSending(true);
    setError("");

    const {
      error: insertError,
    } = await supabase
      .from("direct_messages")
      .insert({
        conversation_id:
          conversationId,
        sender_id:
          currentUserId,
        content,
        message_type:
          "text",
      });

    if (insertError) {
      console.error(
        "VYRO message send error:",
        insertError,
      );

      setError(
        insertError.message,
      );

      setSending(false);
      return false;
    }

    const {
      error: conversationError,
    } = await supabase
      .from("conversations")
      .update({
        updated_at:
          new Date().toISOString(),
      })
      .eq(
        "id",
        conversationId,
      );

    if (
      conversationError
    ) {
      console.error(
        "VYRO conversation update error:",
        conversationError,
      );
    }

    await loadMessages();

    setSending(false);
    return true;
  }

  async function editMessage(
    messageId: string,
    content: string,
  ) {
    if (!currentUserId) {
      setError(
        "Debes iniciar sesión.",
      );

      return false;
    }

    setEditingId(
      messageId,
    );

    setError("");

    const {
      error: updateError,
    } = await supabase
      .from("direct_messages")
      .update({
        content,
      })
      .eq(
        "id",
        messageId,
      )
      .eq(
        "sender_id",
        currentUserId,
      );

    if (updateError) {
      console.error(
        "VYRO message edit error:",
        updateError,
      );

      setError(
        updateError.message,
      );

      setEditingId(null);
      return false;
    }

    await loadMessages();

    setEditingId(null);
    return true;
  }

  async function deleteMessage(
    messageId: string,
  ) {
    const confirmed =
      window.confirm(
        "¿Quieres eliminar este mensaje?",
      );

    if (!confirmed) {
      return;
    }

    setDeletingId(
      messageId,
    );

    setError("");

    const {
      error: deleteError,
    } = await supabase
      .from("direct_messages")
      .delete()
      .eq(
        "id",
        messageId,
      );

    if (deleteError) {
      console.error(
        "VYRO message delete error:",
        deleteError,
      );

      setError(
        deleteError.message,
      );

      setDeletingId(null);
      return;
    }

    await loadMessages();
    setDeletingId(null);
  }

  return (
    <section className="flex h-full min-w-0 flex-1 flex-col bg-gradient-to-br from-black via-[#071019] to-black">
      <header className="flex items-center gap-4 border-b border-white/10 bg-[#080B10]/90 px-6 py-4 backdrop-blur-xl">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-600 font-black text-black">
          {username
            .charAt(0)
            .toUpperCase()}
        </div>

        <div>
          <h2 className="text-xl font-black text-white">
            @{username}
          </h2>

          <p className="text-sm text-slate-400">
            Conversación privada
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-slate-400">
              Cargando mensajes...
            </p>
          </div>
        ) : error ? (
          <div className="flex h-full items-center justify-center">
            <p className="max-w-md rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-center text-red-200">
              {error}
            </p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="max-w-sm text-center">
              <MessageCircle
                size={56}
                className="mx-auto text-cyan-400"
              />

              <h3 className="mt-5 text-2xl font-black text-white">
                Inicia la conversación
              </h3>

              <p className="mt-2 text-slate-400">
                Envía el primer mensaje a @{username}.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map(
              (message) => (
                <MessageBubble
                  key={message.id}
                  id={message.id}
                  content={
                    message.content
                  }
                  createdAt={
                    message.created_at
                  }
                  updatedAt={
                    message.updated_at
                  }
                  readAt={
                    message.read_at
                  }
                  isOwn={
                    message.sender_id ===
                    currentUserId
                  }
                  deleting={
                    deletingId ===
                    message.id
                  }
                  editing={
                    editingId ===
                    message.id
                  }
                  onDelete={
                    deleteMessage
                  }
                  onEdit={
                    editMessage
                  }
                />
              ),
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {error && !loading ? (
        <p className="border-t border-red-500/10 bg-red-500/5 px-4 py-2 text-sm text-red-300">
          {error}
        </p>
      ) : null}

      <MessageInput
        sending={sending}
        onSend={sendMessage}
      />
    </section>
  );
}

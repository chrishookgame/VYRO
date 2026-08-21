"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { MessageCircle } from "lucide-react";

import { supabase } from "@/lib/supabase";

import ConversationCard from "./ConversationCard";
import UserSearch from "./UserSearch";

type ConversationRow = {
  id: string;
  user_one_id: string;
  user_two_id: string;
  updated_at: string;
};

type ProfileRow = {
  id: string;
  username: string | null;
  full_name: string | null;
};

type ConversationItem = {
  id: string;
  otherUserId: string;
  username: string;
  fullName: string;
  lastMessage: string;
  unreadCount: number;
};

type MessagePreviewRow = {
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: string;
  read_at: string | null;
  created_at: string;
};

type ConversationListProps = {
  initialConversationId?:
    string | null;

  selectedConversationId:
    string | null;

  refreshKey: number;

  onSelectConversation: (
    conversationId: string,
    otherUserId: string,
    username: string,
  ) => void;
};

export default function ConversationList({
  initialConversationId,
  selectedConversationId,
  refreshKey,
  onSelectConversation,
}: ConversationListProps) {
  const [
    conversations,
    setConversations,
  ] = useState<
    ConversationItem[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadConversations =
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
          "Debes iniciar sesión para ver tus mensajes.",
        );

        setLoading(false);
        return;
      }

      const {
        data: conversationData,
        error: conversationError,
      } = await supabase
        .from("conversations")
        .select(
          "id, user_one_id, user_two_id, updated_at",
        )
        .or(
          `user_one_id.eq.${user.id},user_two_id.eq.${user.id}`,
        )
        .order("updated_at", {
          ascending: false,
        });

      if (conversationError) {
        console.error(
          "VYRO conversations error:",
          conversationError,
        );

        setError(
          conversationError.message,
        );

        setLoading(false);
        return;
      }

      const rows =
        (conversationData ??
          []) as ConversationRow[];

      const otherUserIds = [
        ...new Set(
          rows.map(
            (conversation) =>
              conversation.user_one_id ===
              user.id
                ? conversation.user_two_id
                : conversation.user_one_id,
          ),
        ),
      ];

      const profileMap =
        new Map<
          string,
          ProfileRow
        >();

      if (
        otherUserIds.length > 0
      ) {
        const {
          data: profileData,
          error: profileError,
        } = await supabase
          .from("profiles")
          .select(
            "id, username, full_name",
          )
          .in(
            "id",
            otherUserIds,
          );

        if (profileError) {
          console.error(
            "VYRO conversation profiles error:",
            profileError,
          );
        }

        for (
          const profile of
            (profileData ??
              []) as ProfileRow[]
        ) {
          profileMap.set(
            profile.id,
            profile,
          );
        }
      }

      const conversationIds =
        rows.map(
          (conversation) =>
            conversation.id,
        );

      const messageMap =
        new Map<
          string,
          MessagePreviewRow[]
        >();

      if (
        conversationIds.length > 0
      ) {
        const {
          data: messageData,
          error: messageError,
        } = await supabase
          .from("direct_messages")
          .select(
            "conversation_id, sender_id, content, message_type, read_at, created_at",
          )
          .in(
            "conversation_id",
            conversationIds,
          )
          .order("created_at", {
            ascending: false,
          });

        if (messageError) {
          console.error(
            "VYRO conversation messages error:",
            messageError,
          );
        }

        for (
          const message of
            (messageData ??
              []) as MessagePreviewRow[]
        ) {
          const existing =
            messageMap.get(
              message.conversation_id,
            ) ?? [];

          existing.push(message);

          messageMap.set(
            message.conversation_id,
            existing,
          );
        }
      }

      const formatted =
        rows.map(
          (
            conversation,
          ): ConversationItem => {
            const otherUserId =
              conversation.user_one_id ===
              user.id
                ? conversation.user_two_id
                : conversation.user_one_id;

            const profile =
              profileMap.get(
                otherUserId,
              );

            const messages =
              messageMap.get(
                conversation.id,
              ) ?? [];

            const latestMessage =
              messages[0];

            const unreadCount =
              messages.filter(
                (message) =>
                  message.sender_id !==
                    user.id &&
                  message.read_at === null,
              ).length;

            const lastMessage =
              latestMessage
                ? latestMessage.message_type ===
                  "text"
                  ? latestMessage.content
                  : latestMessage.message_type ===
                      "image"
                    ? "Imagen"
                    : latestMessage.message_type ===
                        "video"
                      ? "Video"
                      : "Archivo"
                : "";

            return {
              id: conversation.id,
              otherUserId,
              username:
                profile?.username ??
                "usuario",
              fullName:
                profile?.full_name ??
                "",
              lastMessage,
              unreadCount,
            };
          },
        );

      setConversations(
        formatted,
      );

      setLoading(false);
    }, []);

  useEffect(() => {
    void loadConversations();
  }, [
    loadConversations,
    refreshKey,
  ]);

  useEffect(() => {
    if (
      !initialConversationId ||
      selectedConversationId ===
        initialConversationId
    ) {
      return;
    }

    const initialConversation =
      conversations.find(
        (conversation) =>
          conversation.id ===
          initialConversationId,
      );

    if (!initialConversation) {
      return;
    }

    onSelectConversation(
      initialConversation.id,
      initialConversation.otherUserId,
      initialConversation.username,
    );
  }, [
    conversations,
    initialConversationId,
    onSelectConversation,
    selectedConversationId,
  ]);

  return (
    <aside className="flex h-full w-full flex-col border-r border-white/10 bg-[#080B10] md:w-96">
      <header className="border-b border-white/10 p-6">
        <div className="flex items-center gap-3">
          <MessageCircle
            className="text-cyan-400"
            size={28}
          />

          <div>
            <h1 className="text-2xl font-black text-white">
              Mensajes
            </h1>

            <p className="text-sm text-slate-400">
              Conversaciones privadas
            </p>
          </div>
        </div>
      </header>

      <UserSearch
        onConversationCreated={
          onSelectConversation
        }
      />

      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-400">
            Cargando conversaciones...
          </p>
        ) : error ? (
          <p className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-200">
            {error}
          </p>
        ) : conversations.length ===
          0 ? (
          <div className="rounded-2xl border border-dashed border-cyan-500/20 bg-white/5 p-6 text-center">
            <p className="font-bold text-white">
              No tienes conversaciones
            </p>

            <p className="mt-2 text-sm text-slate-400">
              Busca un usuario para iniciar un chat.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.map(
              (conversation) => (
                <ConversationCard
                  key={
                    conversation.id
                  }
                  conversationId={
                    conversation.id
                  }
                  username={
                    conversation.username
                  }
                  fullName={
                    conversation.fullName
                  }
                  lastMessage={
                    conversation.lastMessage
                  }
                  unreadCount={
                    conversation.unreadCount
                  }
                  selected={
                    selectedConversationId ===
                    conversation.id
                  }
                  onSelect={() =>
                    onSelectConversation(
                      conversation.id,
                      conversation.otherUserId,
                      conversation.username,
                    )
                  }
                />
              ),
            )}
          </div>
        )}
      </div>
    </aside>
  );
}

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
};

type ConversationListProps = {
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

            return {
              id: conversation.id,
              otherUserId,
              username:
                profile?.username ??
                "usuario",
              fullName:
                profile?.full_name ??
                "",
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

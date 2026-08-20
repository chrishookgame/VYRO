"use client";

import {
  useState,
} from "react";

import {
  MessagesSquare,
} from "lucide-react";

import ChatWindow from "@/components/messages/ChatWindow";
import ConversationList from "@/components/messages/ConversationList";

export default function MessagesPage() {
  const [
    selectedConversationId,
    setSelectedConversationId,
  ] =
    useState<string | null>(
      null,
    );

  const [
    selectedUsername,
    setSelectedUsername,
  ] = useState("");

  const [
    refreshKey,
    setRefreshKey,
  ] = useState(0);

  function selectConversation(
    conversationId: string,
    _otherUserId: string,
    username: string,
  ) {
    setSelectedConversationId(
      conversationId,
    );

    setSelectedUsername(
      username,
    );

    setRefreshKey(
      (value) =>
        value + 1,
    );
  }

  return (
    <main className="flex h-screen overflow-hidden bg-black text-white">
      <ConversationList
        selectedConversationId={
          selectedConversationId
        }
        refreshKey={
          refreshKey
        }
        onSelectConversation={
          selectConversation
        }
      />

      {selectedConversationId ? (
        <ChatWindow
          conversationId={
            selectedConversationId
          }
          username={
            selectedUsername
          }
          onMessagesRead={() => {
            setRefreshKey(
              (value) =>
                value + 1,
            );
          }}
        />
      ) : (
        <section className="hidden flex-1 items-center justify-center bg-gradient-to-br from-black via-[#071019] to-black md:flex">
          <div className="max-w-md px-8 text-center">
            <MessagesSquare
              size={64}
              className="mx-auto text-cyan-400"
            />

            <h2 className="mt-6 text-3xl font-black">
              VYRO Messages
            </h2>

            <p className="mt-3 text-slate-400">
              Busca un usuario o selecciona una conversación.
            </p>
          </div>
        </section>
      )}
    </main>
  );
}

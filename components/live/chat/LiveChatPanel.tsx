"use client";

import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  LoaderCircle,
  MessageCircle,
  Send,
  ShieldCheck,
} from "lucide-react";

import type {
  LiveChatMessage,
} from "@/lib/live";

interface LiveChatPanelProps {
  messages: LiveChatMessage[];
  loading: boolean;
  sending: boolean;
  connected: boolean;
  error: string;
  onSendMessage: (
    content: string,
  ) => Promise<LiveChatMessage | null>;
}

export default function LiveChatPanel({
  messages,
  loading,
  sending,
  connected,
  error,
  onSendMessage,
}: LiveChatPanelProps) {
  const [content, setContent] =
    useState("");

  const bottomRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const message = content.trim();

    if (!message || sending) {
      return;
    }

    const sentMessage =
      await onSendMessage(message);

    if (sentMessage) {
      setContent("");
    }
  }

  return (
    <section className="flex min-h-[620px] flex-col overflow-hidden rounded-[2rem] border border-cyan-400/15 bg-[#07111D] shadow-[0_25px_90px_rgba(0,0,0,0.35)]">
      <header className="border-b border-white/10 p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
              <MessageCircle
                size={22}
                className="text-cyan-300"
              />
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">
                VYRO LIVE CHAT
              </p>

              <h2 className="mt-1 text-lg font-black text-white">
                Comunidad en tiempo real
              </h2>
            </div>
          </div>

          <div
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-black ${
              connected
                ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-300"
                : "border-yellow-400/25 bg-yellow-400/10 text-yellow-300"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                connected
                  ? "animate-pulse bg-emerald-300"
                  : "bg-yellow-300"
              }`}
            />

            {connected
              ? "Conectado"
              : "Conectando"}
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-5">
        {loading && messages.length === 0 ? (
          <div className="flex min-h-[360px] items-center justify-center">
            <div className="text-center">
              <LoaderCircle
                size={32}
                className="mx-auto animate-spin text-cyan-300"
              />

              <p className="mt-3 text-sm text-gray-400">
                Cargando conversación...
              </p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex min-h-[360px] items-center justify-center">
            <div className="max-w-xs text-center">
              <MessageCircle
                size={38}
                className="mx-auto text-cyan-300"
              />

              <h3 className="mt-4 text-lg font-black text-white">
                Inicia la conversación
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-400">
                Sé la primera persona en compartir energía positiva en este LIVE.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => {
              const profileName =
                message.profile?.fullName ||
                message.profile?.username ||
                "Usuario VYRO";

              const initials = profileName
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <article
                  key={message.id}
                  className="flex gap-3 rounded-2xl border border-white/5 bg-white/[0.025] p-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-cyan-400/20 bg-cyan-400/10 text-xs font-black text-cyan-200">
                    {message.profile?.avatarUrl ? (
                      <span
                        role="img"
                        aria-label={profileName}
                        className="h-full w-full bg-cover bg-center"
                        style={{
                          backgroundImage:
                            `url("${message.profile.avatarUrl}")`,
                        }}
                      />
                    ) : (
                      initials
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-black text-white">
                        {profileName}
                      </p>

                      {message.profile?.verified ? (
                        <ShieldCheck
                          size={15}
                          className="text-cyan-300"
                        />
                      ) : null}

                      <time className="text-[11px] text-gray-500">
                        {new Intl.DateTimeFormat(
                          "es-419",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        ).format(
                          new Date(
                            message.createdAt,
                          ),
                        )}
                      </time>
                    </div>

                    <p className="mt-2 break-words text-sm leading-6 text-gray-300">
                      {message.message}
                    </p>
                  </div>
                </article>
              );
            })}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <footer className="border-t border-white/10 p-5">
        {error ? (
          <div className="mb-4 rounded-2xl border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        <form
          onSubmit={(event) => {
            void handleSubmit(event);
          }}
          className="flex gap-3"
        >
          <input
            type="text"
            value={content}
            onChange={(event) => {
              setContent(event.target.value);
            }}
            maxLength={500}
            disabled={sending}
            placeholder="Escribe en el chat LIVE..."
            className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={
              sending ||
              !content.trim()
            }
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-400 text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Enviar mensaje"
          >
            {sending ? (
              <LoaderCircle
                size={20}
                className="animate-spin"
              />
            ) : (
              <Send size={20} />
            )}
          </button>
        </form>

        <div className="mt-3 flex items-center justify-between gap-4 text-[11px] text-gray-500">
          <span>
            Comunidad segura VYRO
          </span>

          <span>
            {content.length}/500
          </span>
        </div>
      </footer>
    </section>
  );
}

"use client";

import {
  useState,
  type KeyboardEvent,
} from "react";

import {
  Send,
} from "lucide-react";

type MessageInputProps = {
  sending: boolean;
  onSend: (
    content: string,
  ) => Promise<boolean>;
};

export default function MessageInput({
  sending,
  onSend,
}: MessageInputProps) {
  const [content, setContent] =
    useState("");

  async function submitMessage() {
    const cleanContent =
      content.trim();

    if (
      !cleanContent ||
      sending
    ) {
      return;
    }

    const sent =
      await onSend(
        cleanContent,
      );

    if (sent) {
      setContent("");
    }
  }

  function handleKeyDown(
    event:
      KeyboardEvent<HTMLTextAreaElement>,
  ) {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      void submitMessage();
    }
  }

  return (
    <footer className="border-t border-white/10 bg-[#080B10] p-4">
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(event) =>
              setContent(
                event.target.value,
              )
            }
            onKeyDown={
              handleKeyDown
            }
            disabled={sending}
            maxLength={2000}
            rows={1}
            placeholder="Escribe un mensaje..."
            className="max-h-40 min-h-12 w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-500/50 disabled:opacity-60"
          />

          <div className="mt-1 text-right text-[11px] text-slate-600">
            {content.length}/2000
          </div>
        </div>

        <button
          type="button"
          aria-label="Enviar mensaje"
          onClick={() =>
            void submitMessage()
          }
          disabled={
            sending ||
            !content.trim()
          }
          className="mb-5 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cyan-500 text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send size={20} />
        </button>
      </div>
    </footer>
  );
}

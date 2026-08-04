"use client";

import {
  useEffect,
  useState,
  type KeyboardEvent,
} from "react";

import {
  Check,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

type MessageBubbleProps = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  readAt: string | null;
  isOwn: boolean;
  deleting: boolean;
  editing: boolean;
  onDelete: (messageId: string) => void;
  onEdit: (
    messageId: string,
    content: string,
  ) => Promise<boolean>;
};

export default function MessageBubble({
  id,
  content,
  createdAt,
  updatedAt,
  readAt,
  isOwn,
  deleting,
  editing,
  onDelete,
  onEdit,
}: MessageBubbleProps) {
  const [editMode, setEditMode] =
    useState(false);

  const [draft, setDraft] =
    useState(content);

  useEffect(() => {
    setDraft(content);
  }, [content]);

  const wasEdited =
    new Date(updatedAt).getTime() >
    new Date(createdAt).getTime() + 1000;

  async function saveEdit() {
    const cleanDraft =
      draft.trim();

    if (
      !cleanDraft ||
      cleanDraft === content ||
      editing
    ) {
      if (
        cleanDraft === content
      ) {
        setEditMode(false);
      }

      return;
    }

    const saved =
      await onEdit(
        id,
        cleanDraft,
      );

    if (saved) {
      setEditMode(false);
    }
  }

  function cancelEdit() {
    setDraft(content);
    setEditMode(false);
  }

  function handleEditKeyDown(
    event:
      KeyboardEvent<HTMLTextAreaElement>,
  ) {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      void saveEdit();
    }

    if (
      event.key === "Escape"
    ) {
      event.preventDefault();
      cancelEdit();
    }
  }

  return (
    <div
      className={
        isOwn
          ? "flex justify-end"
          : "flex justify-start"
      }
    >
      <article
        className={
          isOwn
            ? "group max-w-[82%] rounded-3xl rounded-br-md bg-cyan-500 px-4 py-3 text-black shadow-lg"
            : "group max-w-[82%] rounded-3xl rounded-bl-md border border-white/10 bg-white/10 px-4 py-3 text-white"
        }
      >
        {editMode ? (
          <div className="min-w-[240px]">
            <textarea
              value={draft}
              onChange={(event) =>
                setDraft(
                  event.target.value,
                )
              }
              onKeyDown={
                handleEditKeyDown
              }
              disabled={editing}
              maxLength={2000}
              autoFocus
              className="min-h-24 w-full resize-none rounded-2xl border border-black/20 bg-white/80 p-3 text-sm text-black outline-none focus:border-black/40 disabled:opacity-60"
            />

            <div className="mt-2 flex items-center justify-between gap-3">
              <span className="text-[11px] text-black/60">
                {draft.length}/2000
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Cancelar edición"
                  title="Cancelar"
                  onClick={
                    cancelEdit
                  }
                  disabled={editing}
                  className="rounded-full bg-black/10 p-2 text-black/70 transition hover:bg-black/20 disabled:opacity-40"
                >
                  <X size={15} />
                </button>

                <button
                  type="button"
                  aria-label="Guardar edición"
                  title="Guardar"
                  onClick={() =>
                    void saveEdit()
                  }
                  disabled={
                    editing ||
                    !draft.trim() ||
                    draft.trim() ===
                      content
                  }
                  className="rounded-full bg-black p-2 text-cyan-300 transition hover:bg-black/80 disabled:opacity-40"
                >
                  <Check
                    size={15}
                  />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="whitespace-pre-wrap break-words text-sm leading-6">
            {content}
          </p>
        )}

        {!editMode ? (
          <div className="mt-2 flex items-center justify-end gap-3">
            <time
              className={
                isOwn
                  ? "text-[11px] text-black/60"
                  : "text-[11px] text-slate-500"
              }
            >
              {new Date(
                createdAt,
              ).toLocaleTimeString(
                "es",
                {
                  hour:
                    "2-digit",
                  minute:
                    "2-digit",
                },
              )}
            </time>

            {wasEdited ? (
              <span
                className={
                  isOwn
                    ? "text-[10px] font-semibold text-black/50"
                    : "text-[10px] font-semibold text-slate-500"
                }
              >
                Editado
              </span>
            ) : null}

            {isOwn ? (
              <>
                <span className="text-[10px] font-semibold text-black/60">
                  {readAt
                    ? "Visto"
                    : "Enviado"}
                </span>

                <button
                  type="button"
                  aria-label="Editar mensaje"
                  title="Editar mensaje"
                  disabled={
                    deleting ||
                    editing
                  }
                  onClick={() =>
                    setEditMode(true)
                  }
                  className="rounded-full p-1 text-black/60 opacity-0 transition hover:bg-black/10 hover:text-black group-hover:opacity-100 disabled:opacity-40"
                >
                  <Pencil
                    size={14}
                  />
                </button>

                <button
                  type="button"
                  aria-label="Eliminar mensaje"
                  title="Eliminar mensaje"
                  disabled={
                    deleting ||
                    editing
                  }
                  onClick={() =>
                    onDelete(id)
                  }
                  className="rounded-full p-1 text-black/60 opacity-0 transition hover:bg-black/10 hover:text-black group-hover:opacity-100 disabled:opacity-40"
                >
                  <Trash2
                    size={14}
                  />
                </button>
              </>
            ) : null}
          </div>
        ) : null}
      </article>
    </div>
  );
}

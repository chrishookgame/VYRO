"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Trash2,
  X,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

type CommentRow = {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
};

type CommentItem = CommentRow & {
  username: string;
};

type TalkPanelProps = {
  postId: string;
  onClose: () => void;
  onCountChange: (count: number) => void;
};

export default function TalkPanel({
  postId,
  onClose,
  onCountChange,
}: TalkPanelProps) {
  const [comments, setComments] =
    useState<CommentItem[]>([]);

  const [currentUserId, setCurrentUserId] =
    useState<string | null>(null);

  const [content, setContent] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [sending, setSending] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState("");

  const loadComments =
    useCallback(async () => {
      setLoading(true);
      setMessage("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      setCurrentUserId(
        user?.id ?? null,
      );

      const {
        data: commentData,
        error: commentError,
      } = await supabase
        .from("post_comments")
        .select(
          "id, user_id, content, created_at",
        )
        .eq("post_id", postId)
        .order("created_at", {
          ascending: true,
        });

      if (commentError) {
        console.error(
          "VYRO comments load error:",
          commentError,
        );

        setMessage(
          "No fue posible cargar los comentarios.",
        );

        setLoading(false);
        return;
      }

      const rows =
        (commentData ?? []) as CommentRow[];

      const userIds = [
        ...new Set(
          rows.map(
            (comment) =>
              comment.user_id,
          ),
        ),
      ];

      const profileMap =
        new Map<string, string>();

      if (userIds.length > 0) {
        const {
          data: profileData,
          error: profileError,
        } = await supabase
          .from("profiles")
          .select(
            "id, username, full_name",
          )
          .in("id", userIds);

        if (profileError) {
          console.error(
            "VYRO comment profiles error:",
            profileError,
          );
        }

        for (
          const profile of
            profileData ?? []
        ) {
          profileMap.set(
            profile.id,
            profile.username ??
              profile.full_name ??
              "Miembro VYRO",
          );
        }
      }

      const formatted =
        rows.map((comment) => ({
          ...comment,
          username:
            profileMap.get(
              comment.user_id,
            ) ?? "Miembro VYRO",
        }));

      setComments(formatted);
      onCountChange(formatted.length);
      setLoading(false);
    }, [postId, onCountChange]);

  useEffect(() => {
    void loadComments();
  }, [loadComments]);

  async function sendComment() {
    const cleanContent =
      content.trim();

    if (!cleanContent) {
      setMessage(
        "Escribe un comentario.",
      );

      return;
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setMessage(
        "Debes iniciar sesión para comentar.",
      );

      return;
    }

    setSending(true);
    setMessage("");

    const {
      error: insertError,
    } = await supabase
      .from("post_comments")
      .insert({
        post_id: postId,
        user_id: user.id,
        content: cleanContent,
      });

    if (insertError) {
      console.error(
        "VYRO comment insert error:",
        insertError,
      );

      setMessage(
        insertError.message,
      );

      setSending(false);
      return;
    }

    setContent("");
    await loadComments();
    setSending(false);
  }

  async function deleteComment(
    commentId: string,
  ) {
    const confirmed =
      window.confirm(
        "¿Quieres eliminar este comentario?",
      );

    if (!confirmed) {
      return;
    }

    setDeletingId(commentId);
    setMessage("");

    const {
      error: deleteError,
    } = await supabase
      .from("post_comments")
      .delete()
      .eq("id", commentId);

    if (deleteError) {
      console.error(
        "VYRO comment delete error:",
        deleteError,
      );

      setMessage(
        deleteError.message,
      );

      setDeletingId(null);
      return;
    }

    await loadComments();
    setDeletingId(null);
  }

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Cerrar comentarios"
        onClick={onClose}
        className="absolute inset-0"
      />

      <section className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-cyan-500/20 bg-[#05070A] text-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-white/10 p-5">
          <div>
            <h2 className="text-xl font-black">
              Talk
            </h2>

            <p className="text-sm text-gray-400">
              {comments.length} comentarios
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 p-2 hover:bg-white/10"
          >
            <X size={22} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <p className="text-gray-400">
              Cargando comentarios...
            </p>
          ) : comments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-cyan-500/20 p-6 text-center text-gray-400">
              Sé el primero en comentar.
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map(
                (comment) => (
                  <article
                    key={comment.id}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-cyan-300">
                          @{comment.username}
                        </p>

                        <p className="mt-2 break-words text-sm text-gray-200">
                          {comment.content}
                        </p>

                        <time className="mt-3 block text-xs text-gray-500">
                          {new Date(
                            comment.created_at,
                          ).toLocaleString(
                            "es",
                          )}
                        </time>
                      </div>

                      {currentUserId ===
                      comment.user_id ? (
                        <button
                          type="button"
                          aria-label="Eliminar comentario"
                          onClick={() =>
                            void deleteComment(
                              comment.id,
                            )
                          }
                          disabled={
                            deletingId ===
                            comment.id
                          }
                          className="rounded-full border border-red-500/20 p-2 text-red-300 transition hover:bg-red-500/10 disabled:opacity-50"
                        >
                          <Trash2
                            size={17}
                          />
                        </button>
                      ) : null}
                    </div>
                  </article>
                ),
              )}
            </div>
          )}
        </div>

        <footer className="border-t border-white/10 p-4">
          <textarea
            value={content}
            onChange={(event) =>
              setContent(
                event.target.value,
              )
            }
            maxLength={500}
            disabled={sending}
            placeholder="Escribe un comentario..."
            className="min-h-24 w-full resize-none rounded-2xl border border-white/10 bg-white/5 p-4 text-white outline-none placeholder:text-gray-500 focus:border-cyan-500/50 disabled:opacity-60"
          />

          <div className="mt-1 text-right text-xs text-gray-500">
            {content.length}/500
          </div>

          <button
            type="button"
            onClick={() =>
              void sendComment()
            }
            disabled={
              sending ||
              !content.trim()
            }
            className="mt-3 w-full rounded-xl bg-cyan-500 py-3 font-bold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sending
              ? "Enviando..."
              : "Enviar comentario"}
          </button>

          {message ? (
            <p className="mt-3 text-sm text-amber-300">
              {message}
            </p>
          ) : null}
        </footer>
      </section>
    </div>
  );
}

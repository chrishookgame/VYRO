"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Search,
  UserPlus,
  X,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

type UserResult = {
  id: string;
  username: string;
  full_name: string | null;
};

type UserSearchProps = {
  onConversationCreated: (
    conversationId: string,
    otherUserId: string,
    username: string,
  ) => void;
};

export default function UserSearch({
  onConversationCreated,
}: UserSearchProps) {
  const [query, setQuery] =
    useState("");

  const [results, setResults] =
    useState<UserResult[]>([]);

  const [
    currentUserId,
    setCurrentUserId,
  ] =
    useState<string | null>(
      null,
    );

  const [searching, setSearching] =
    useState(false);

  const [creatingId, setCreatingId] =
    useState<string | null>(
      null,
    );

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    async function loadCurrentUser() {
      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      setCurrentUserId(
        user?.id ?? null,
      );
    }

    void loadCurrentUser();
  }, []);

  const searchUsers =
    useCallback(
      async (
        cleanQuery: string,
      ) => {
        if (!currentUserId) {
          setResults([]);
          setSearching(false);
          return;
        }

        setSearching(true);
        setMessage("");

        const {
          data,
          error,
        } =
          await supabase
            .from("profiles")
            .select(
              "id, username, full_name",
            )
            .neq(
              "id",
              currentUserId,
            )
            .ilike(
              "username",
              `%${cleanQuery}%`,
            )
            .limit(10);

        if (error) {
          console.error(
            "VYRO user search error:",
            error,
          );

          setMessage(
            error.message,
          );

          setResults([]);
          setSearching(false);
          return;
        }

        setResults(
          (data ??
            []) as UserResult[],
        );

        setSearching(false);
      },
      [currentUserId],
    );

  useEffect(() => {
    const cleanQuery =
      query.trim();

    if (
      cleanQuery.length < 2 ||
      !currentUserId
    ) {
      setResults([]);
      setSearching(false);
      return;
    }

    const timer =
      window.setTimeout(
        () => {
          void searchUsers(
            cleanQuery,
          );
        },
        350,
      );

    return () => {
      window.clearTimeout(
        timer,
      );
    };
  }, [
    query,
    currentUserId,
    searchUsers,
  ]);

  async function startConversation(
    selectedUser: UserResult,
  ) {
    if (!currentUserId) {
      setMessage(
        "Debes iniciar sesión.",
      );

      return;
    }

    setCreatingId(
      selectedUser.id,
    );

    setMessage("");

    const orderedIds = [
      currentUserId,
      selectedUser.id,
    ].sort();

    const userOneId =
      orderedIds[0];

    const userTwoId =
      orderedIds[1];

    const {
      data: existingConversation,
      error: existingError,
    } =
      await supabase
        .from("conversations")
        .select("id")
        .eq(
          "user_one_id",
          userOneId,
        )
        .eq(
          "user_two_id",
          userTwoId,
        )
        .maybeSingle();

    if (existingError) {
      console.error(
        "VYRO conversation lookup error:",
        existingError,
      );

      setMessage(
        existingError.message,
      );

      setCreatingId(null);
      return;
    }

    if (
      existingConversation
    ) {
      onConversationCreated(
        existingConversation.id,
        selectedUser.id,
        selectedUser.username,
      );

      setQuery("");
      setResults([]);
      setCreatingId(null);
      return;
    }

    const {
      data: createdConversation,
      error: createError,
    } =
      await supabase
        .from("conversations")
        .insert({
          user_one_id:
            userOneId,
          user_two_id:
            userTwoId,
        })
        .select("id")
        .single();

    if (
      createError ||
      !createdConversation
    ) {
      console.error(
        "VYRO conversation creation error:",
        createError,
      );

      setMessage(
        createError?.message ??
          "No fue posible crear la conversación.",
      );

      setCreatingId(null);
      return;
    }

    onConversationCreated(
      createdConversation.id,
      selectedUser.id,
      selectedUser.username,
    );

    setQuery("");
    setResults([]);
    setCreatingId(null);
  }

  return (
    <section className="border-b border-white/10 bg-[#080B10] p-4">
      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
        />

        <input
          type="text"
          value={query}
          onChange={(event) =>
            setQuery(
              event.target.value,
            )
          }
          placeholder="Buscar usuario..."
          className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-11 text-white outline-none placeholder:text-slate-500 focus:border-cyan-500/50"
        />

        {query ? (
          <button
            type="button"
            aria-label="Limpiar búsqueda"
            onClick={() => {
              setQuery("");
              setResults([]);
              setMessage("");
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-400 hover:bg-white/10"
          >
            <X size={16} />
          </button>
        ) : null}
      </div>

      {query.trim().length ===
      1 ? (
        <p className="mt-3 text-xs text-slate-500">
          Escribe al menos 2 caracteres.
        </p>
      ) : null}

      {searching ? (
        <p className="mt-3 text-sm text-slate-400">
          Buscando usuarios...
        </p>
      ) : null}

      {message ? (
        <p className="mt-3 text-sm text-red-300">
          {message}
        </p>
      ) : null}

      {results.length > 0 ? (
        <div className="mt-3 space-y-2">
          {results.map(
            (user) => (
              <button
                key={user.id}
                type="button"
                onClick={() =>
                  void startConversation(
                    user,
                  )
                }
                disabled={
                  creatingId ===
                  user.id
                }
                className="flex w-full items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-3 text-left transition hover:border-cyan-400/30 hover:bg-white/10 disabled:opacity-60"
              >
                <div className="min-w-0">
                  <p className="truncate font-bold text-white">
                    @{user.username}
                  </p>

                  <p className="truncate text-sm text-slate-400">
                    {user.full_name ||
                      "Miembro VYRO"}
                  </p>
                </div>

                <UserPlus
                  size={20}
                  className="shrink-0 text-cyan-400"
                />
              </button>
            ),
          )}
        </div>
      ) : null}

      {!searching &&
      query.trim().length >= 2 &&
      results.length === 0 &&
      !message ? (
        <p className="mt-3 text-sm text-slate-500">
          No se encontraron usuarios.
        </p>
      ) : null}
    </section>
  );
}

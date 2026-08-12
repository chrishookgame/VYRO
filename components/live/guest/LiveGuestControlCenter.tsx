"use client";

import {
  Camera,
  Check,
  LoaderCircle,
  Mic,
  MonitorUp,
  Search,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useLiveGuestInvitations,
} from "@/hooks";

import {
  supabase,
} from "@/lib/supabase";

type GuestSearchResult = {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
};

type LiveGuestControlCenterProps = {
  roomId: string | null;
  disabled?: boolean;
};

function getGuestName(
  user: GuestSearchResult,
): string {
  return (
    user.full_name?.trim() ||
    `@${user.username}`
  );
}

function getInvitationName(
  username: string | null | undefined,
  fullName: string | null | undefined,
): string {
  return (
    fullName?.trim() ||
    (username
      ? `@${username}`
      : "Miembro VYRO")
  );
}

export function LiveGuestControlCenter({
  roomId,
  disabled = false,
}: LiveGuestControlCenterProps) {
  const {
    sent,
    loading,
    connected,
    error: invitationError,
    sendInvitation,
    cancelInvitation,
    revokeInvitation,
  } = useLiveGuestInvitations();

  const [
    open,
    setOpen,
  ] = useState(false);

  const [
    query,
    setQuery,
  ] = useState("");

  const [
    results,
    setResults,
  ] = useState<GuestSearchResult[]>([]);

  const [
    currentUserId,
    setCurrentUserId,
  ] = useState<string | null>(null);

  const [
    searching,
    setSearching,
  ] = useState(false);

  const [
    selectedUser,
    setSelectedUser,
  ] = useState<GuestSearchResult | null>(null);

  const [
    canPublishCamera,
    setCanPublishCamera,
  ] = useState(true);

  const [
    canPublishMicrophone,
    setCanPublishMicrophone,
  ] = useState(true);

  const [
    canShareScreen,
    setCanShareScreen,
  ] = useState(false);

  const [
    processingId,
    setProcessingId,
  ] = useState<string | null>(null);

  const [
    localError,
    setLocalError,
  ] = useState("");

  const [
    localMessage,
    setLocalMessage,
  ] = useState("");

  useEffect(() => {
    async function loadCurrentUser() {
      const {
        data: {
          user,
        },
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
          return;
        }

        setSearching(true);
        setLocalError("");

        const {
          data,
          error,
        } =
          await supabase
            .from("profiles")
            .select(
              "id,username,full_name,avatar_url",
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
            "VYRO Guest user search error:",
            error,
          );

          setLocalError(
            error.message,
          );

          setResults([]);
          setSearching(false);
          return;
        }

        setResults(
          (
            data ??
            []
          ) as GuestSearchResult[],
        );

        setSearching(false);
      },
      [
        currentUserId,
      ],
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
    currentUserId,
    query,
    searchUsers,
  ]);

  const roomInvitations =
    useMemo(
      () =>
        sent.filter(
          (invitation) =>
            invitation.roomId ===
            roomId,
        ),
      [
        roomId,
        sent,
      ],
    );

  const activeInvitations =
    useMemo(
      () =>
        roomInvitations.filter(
          (invitation) =>
            invitation.status ===
              "pending" ||
            invitation.status ===
              "accepted",
        ),
      [
        roomInvitations,
      ],
    );

  function resetComposer() {
    setQuery("");
    setResults([]);
    setSelectedUser(null);
    setCanPublishCamera(true);
    setCanPublishMicrophone(true);
    setCanShareScreen(false);
    setLocalError("");
    setLocalMessage("");
  }

  async function inviteSelectedUser() {
    if (
      !roomId ||
      !selectedUser
    ) {
      return;
    }

    if (
      !canPublishCamera &&
      !canPublishMicrophone
    ) {
      setLocalError(
        "El invitado necesita cámara o micrófono habilitado.",
      );
      return;
    }

    setProcessingId(
      selectedUser.id,
    );

    setLocalError("");
    setLocalMessage("");

    try {
      await sendInvitation({
        roomId,
        guestId:
          selectedUser.id,
        permissions: {
          canPublishCamera,
          canPublishMicrophone,
          canShareScreen,
        },
        expiresInSeconds:
          300,
      });

      setLocalMessage(
        `Invitación enviada a ${getGuestName(selectedUser)}.`,
      );

      setQuery("");
      setResults([]);
      setSelectedUser(null);
    } catch (inviteError) {
      setLocalError(
        inviteError instanceof Error
          ? inviteError.message
          : "No fue posible enviar la invitación Guest.",
      );
    } finally {
      setProcessingId(null);
    }
  }

  async function cancelGuestInvitation(
    invitationId: string,
  ) {
    setProcessingId(
      invitationId,
    );

    setLocalError("");

    try {
      await cancelInvitation(
        invitationId,
      );
    } catch (cancelError) {
      setLocalError(
        cancelError instanceof Error
          ? cancelError.message
          : "No fue posible cancelar la invitación.",
      );
    } finally {
      setProcessingId(null);
    }
  }

  async function revokeGuestAccess(
    invitationId: string,
  ) {
    setProcessingId(
      invitationId,
    );

    setLocalError("");

    try {
      await revokeInvitation(
        invitationId,
      );
    } catch (revokeError) {
      setLocalError(
        revokeError instanceof Error
          ? revokeError.message
          : "No fue posible retirar al invitado.",
      );
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <div className="mt-5">
      <button
        type="button"
        disabled={
          disabled ||
          !roomId
        }
        onClick={() => {
          setOpen(
            (current) =>
              !current,
          );

          if (open) {
            resetComposer();
          }
        }}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-3 font-semibold text-cyan-300 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <UserPlus size={18} />
        Añadir invitado
      </button>

      {open ? (
        <div className="mt-4 overflow-hidden rounded-2xl border border-cyan-400/20 bg-[#070D16]">
          <div className="flex items-center justify-between border-b border-white/10 p-4">
            <div>
              <div className="flex items-center gap-2">
                <Users
                  size={18}
                  className="text-cyan-400"
                />

                <h3 className="font-black text-white">
                  Guest Control
                </h3>
              </div>

              <p className="mt-1 text-xs text-slate-400">
                Invita participantes y controla sus fuentes multimedia.
              </p>
            </div>

            <div
              className={
                connected
                  ? "h-2.5 w-2.5 rounded-full bg-emerald-400"
                  : "h-2.5 w-2.5 rounded-full bg-slate-600"
              }
              title={
                connected
                  ? "Realtime conectado"
                  : "Realtime desconectado"
              }
            />
          </div>

          <div className="space-y-4 p-4">
            {!selectedUser ? (
              <>
                <div className="relative">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    type="text"
                    value={query}
                    onChange={(
                      event,
                    ) => {
                      setQuery(
                        event.target.value,
                      );

                      setLocalMessage("");
                    }}
                    placeholder="Buscar usuario..."
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-10 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/40"
                  />

                  {query ? (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery("");
                        setResults([]);
                      }}
                      aria-label="Limpiar búsqueda"
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 hover:bg-white/10 hover:text-white"
                    >
                      <X size={15} />
                    </button>
                  ) : null}
                </div>

                {query.trim().length ===
                1 ? (
                  <p className="text-xs text-slate-500">
                    Escribe al menos 2 caracteres.
                  </p>
                ) : null}

                {searching ? (
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <LoaderCircle
                      size={16}
                      className="animate-spin"
                    />
                    Buscando miembros VYRO...
                  </div>
                ) : null}

                {results.length > 0 ? (
                  <div className="space-y-2">
                    {results.map(
                      (user) => (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => {
                            setSelectedUser(
                              user,
                            );

                            setResults([]);
                            setQuery("");
                            setLocalError("");
                          }}
                          className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-3 text-left transition hover:border-cyan-400/40 hover:bg-cyan-500/5"
                        >
                          <div className="min-w-0">
                            <p className="truncate font-bold text-white">
                              {getGuestName(
                                user,
                              )}
                            </p>

                            <p className="truncate text-xs text-slate-500">
                              @{user.username}
                            </p>
                          </div>

                          <UserPlus
                            size={18}
                            className="shrink-0 text-cyan-400"
                          />
                        </button>
                      ),
                    )}
                  </div>
                ) : null}

                {!searching &&
                query.trim().length >=
                  2 &&
                results.length ===
                  0 &&
                !localError ? (
                  <p className="text-sm text-slate-500">
                    No se encontraron usuarios.
                  </p>
                ) : null}
              </>
            ) : (
              <div className="rounded-xl border border-cyan-400/20 bg-cyan-500/5 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-black text-white">
                      {getGuestName(
                        selectedUser,
                      )}
                    </p>

                    <p className="truncate text-xs text-cyan-300">
                      @{selectedUser.username}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedUser(
                        null,
                      );
                    }}
                    className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="mt-4 grid gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCanPublishCamera(
                        (current) =>
                          !current,
                      );
                    }}
                    className={
                      canPublishCamera
                        ? "flex items-center justify-between rounded-xl border border-cyan-400/40 bg-cyan-500/10 p-3 text-cyan-200"
                        : "flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 text-slate-500"
                    }
                  >
                    <span className="flex items-center gap-2 text-sm font-bold">
                      <Camera size={17} />
                      Cámara
                    </span>

                    {canPublishCamera ? (
                      <Check size={17} />
                    ) : null}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCanPublishMicrophone(
                        (current) =>
                          !current,
                      );
                    }}
                    className={
                      canPublishMicrophone
                        ? "flex items-center justify-between rounded-xl border border-cyan-400/40 bg-cyan-500/10 p-3 text-cyan-200"
                        : "flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 text-slate-500"
                    }
                  >
                    <span className="flex items-center gap-2 text-sm font-bold">
                      <Mic size={17} />
                      Micrófono
                    </span>

                    {canPublishMicrophone ? (
                      <Check size={17} />
                    ) : null}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCanShareScreen(
                        (current) =>
                          !current,
                      );
                    }}
                    className={
                      canShareScreen
                        ? "flex items-center justify-between rounded-xl border border-cyan-400/40 bg-cyan-500/10 p-3 text-cyan-200"
                        : "flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 text-slate-500"
                    }
                  >
                    <span className="flex items-center gap-2 text-sm font-bold">
                      <MonitorUp size={17} />
                      Compartir pantalla
                    </span>

                    {canShareScreen ? (
                      <Check size={17} />
                    ) : null}
                  </button>
                </div>

                <button
                  type="button"
                  disabled={
                    processingId ===
                    selectedUser.id
                  }
                  onClick={() => {
                    void inviteSelectedUser();
                  }}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 font-black text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {processingId ===
                  selectedUser.id ? (
                    <LoaderCircle
                      size={18}
                      className="animate-spin"
                    />
                  ) : (
                    <UserPlus size={18} />
                  )}

                  Enviar invitación
                </button>
              </div>
            )}

            {localError ||
            invitationError ? (
              <p className="rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-200">
                {localError ||
                  invitationError}
              </p>
            ) : null}

            {localMessage ? (
              <p className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm text-emerald-200">
                {localMessage}
              </p>
            ) : null}

            <div className="border-t border-white/10 pt-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                  Invitados del LIVE
                </p>

                <span className="text-xs text-slate-500">
                  {activeInvitations.length}
                </span>
              </div>

              {loading ? (
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <LoaderCircle
                    size={15}
                    className="animate-spin"
                  />
                  Cargando invitados...
                </div>
              ) : activeInvitations.length ===
                0 ? (
                <p className="text-sm text-slate-500">
                  Todavía no hay invitados activos.
                </p>
              ) : (
                <div className="space-y-2">
                  {activeInvitations.map(
                    (invitation) => (
                      <div
                        key={invitation.id}
                        className="rounded-xl border border-white/10 bg-white/5 p-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate font-bold text-white">
                              {getInvitationName(
                                invitation
                                  .guest
                                  ?.username,
                                invitation
                                  .guest
                                  ?.full_name,
                              )}
                            </p>

                            <p
                              className={
                                invitation.status ===
                                "accepted"
                                  ? "mt-1 text-xs font-bold text-emerald-300"
                                  : "mt-1 text-xs font-bold text-amber-300"
                              }
                            >
                              {invitation.status ===
                              "accepted"
                                ? "Guest aceptado"
                                : "Esperando respuesta"}
                            </p>
                          </div>

                          <button
                            type="button"
                            disabled={
                              processingId ===
                              invitation.id
                            }
                            onClick={() => {
                              if (
                                invitation.status ===
                                "accepted"
                              ) {
                                void revokeGuestAccess(
                                  invitation.id,
                                );
                              } else {
                                void cancelGuestInvitation(
                                  invitation.id,
                                );
                              }
                            }}
                            className="rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-300 transition hover:bg-red-500/20 disabled:opacity-50"
                          >
                            {processingId ===
                            invitation.id
                              ? "..."
                              : invitation.status ===
                                  "accepted"
                                ? "Retirar"
                                : "Cancelar"}
                          </button>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                          {invitation
                            .permissions
                            .canPublishCamera ? (
                            <span className="rounded-full bg-white/5 px-2 py-1 text-slate-300">
                              Cámara
                            </span>
                          ) : null}

                          {invitation
                            .permissions
                            .canPublishMicrophone ? (
                            <span className="rounded-full bg-white/5 px-2 py-1 text-slate-300">
                              Micrófono
                            </span>
                          ) : null}

                          {invitation
                            .permissions
                            .canShareScreen ? (
                            <span className="rounded-full bg-white/5 px-2 py-1 text-slate-300">
                              Pantalla
                            </span>
                          ) : null}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Check,
  Clock3,
  LoaderCircle,
  Mail,
  Radio,
  Search,
  Send,
  Swords,
  UserRound,
  X,
} from "lucide-react";

import {
  useBattleInvitations,
} from "@/hooks";

import type {
  BattleInvitation,
} from "@/lib/battle-invitations";

import { supabase } from "@/lib/supabase";

import type {
  BattleSeriesConfig,
} from "./BattleScheduler";

interface RivalSearchResult {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
}

interface BattleInvitationPanelProps {
  roomId?: string | null;
  seriesConfig: BattleSeriesConfig;
  disabled?: boolean;
}

function getProfileName(
  invitation: BattleInvitation,
  type: "sender" | "receiver",
): string {
  const profile =
    type === "sender"
      ? invitation.sender
      : invitation.receiver;

  const fallbackId =
    type === "sender"
      ? invitation.senderId
      : invitation.receiverId;

  return (
    profile?.full_name?.trim() ||
    profile?.username?.trim() ||
    `VYRO ${fallbackId
      .slice(0, 8)
      .toUpperCase()}`
  );
}

function getStatusLabel(
  status: BattleInvitation["status"],
): string {
  if (status === "pending") {
    return "Pendiente";
  }

  if (status === "accepted") {
    return "Aceptada";
  }

  if (status === "declined") {
    return "Rechazada";
  }

  if (status === "expired") {
    return "Expirada";
  }

  return "Cancelada";
}

function getRemainingSeconds(
  expiresAt: string,
  now: number,
): number {
  const expiration =
    new Date(expiresAt).getTime();

  if (!Number.isFinite(expiration)) {
    return 0;
  }

  return Math.max(
    0,
    Math.ceil(
      (expiration - now) / 1000,
    ),
  );
}

function formatRemaining(
  totalSeconds: number,
): string {
  const minutes = Math.floor(
    totalSeconds / 60,
  );

  const seconds =
    totalSeconds % 60;

  return `${minutes
    .toString()
    .padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

interface InvitationCardProps {
  invitation: BattleInvitation;
  direction: "received" | "sent";
  now: number;
  busy: boolean;
  onAccept?: () => void;
  onDecline?: () => void;
  onCancel?: () => void;
}

function InvitationCard({
  invitation,
  direction,
  now,
  busy,
  onAccept,
  onDecline,
  onCancel,
}: InvitationCardProps) {
  const personName =
    direction === "received"
      ? getProfileName(
          invitation,
          "sender",
        )
      : getProfileName(
          invitation,
          "receiver",
        );

  const remaining =
    getRemainingSeconds(
      invitation.expiresAt,
      now,
    );

  const isPending =
    invitation.status === "pending" &&
    remaining > 0;

  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-fuchsia-300">
            {direction === "received"
              ? "Invitación recibida"
              : "Invitación enviada"}
          </p>

          <h3 className="mt-2 text-xl font-black text-white">
            {personName}
          </h3>

          <p className="mt-2 text-sm text-white/45">
            {invitation.seriesConfig
              .totalBattles}{" "}
            {invitation.seriesConfig
              .totalBattles === 1
              ? "batalla"
              : "batallas"}{" "}
            ·{" "}
            {invitation.seriesConfig
              .battleDurationSeconds /
              60}{" "}
            min por ronda
          </p>
        </div>

        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-2 text-xs font-black text-white/60">
          {getStatusLabel(
            invitation.status,
          )}
        </span>
      </div>

      {invitation.message ? (
        <p className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/60">
          {invitation.message}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2 text-white/45">
          <Clock3 size={17} />

          <span>
            {isPending
              ? `Expira en ${formatRemaining(
                  remaining,
                )}`
              : getStatusLabel(
                  invitation.status,
                )}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {direction === "received" &&
          isPending ? (
            <>
              <button
                type="button"
                disabled={busy}
                onClick={onDecline}
                className="inline-flex items-center gap-2 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2 font-black text-red-200 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={17} />
                Rechazar
              </button>

              <button
                type="button"
                disabled={busy}
                onClick={onAccept}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-2 font-black text-black transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy ? (
                  <LoaderCircle
                    size={17}
                    className="animate-spin"
                  />
                ) : (
                  <Check size={17} />
                )}
                Aceptar
              </button>
            </>
          ) : null}

          {direction === "sent" &&
          isPending ? (
            <button
              type="button"
              disabled={busy}
              onClick={onCancel}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2 font-black text-white/70 transition hover:border-red-400/30 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? (
                <LoaderCircle
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <X size={17} />
              )}
              Cancelar
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default function BattleInvitationPanel({
  roomId,
  seriesConfig,
  disabled = false,
}: BattleInvitationPanelProps) {
  const {
    received,
    sent,
    loading,
    connected,
    error,
    sendInvitation,
    acceptInvitation,
    declineInvitation,
    cancelInvitation,
  } = useBattleInvitations();

  const [now, setNow] =
    useState(() => Date.now());

  const [busyId, setBusyId] =
    useState<string | null>(null);

  const [actionError, setActionError] =
    useState("");

  const [rivalQuery, setRivalQuery] =
    useState("");

  const [rivalResults, setRivalResults] =
    useState<RivalSearchResult[]>([]);

  const [selectedRival, setSelectedRival] =
    useState<RivalSearchResult | null>(null);

  const [searchingRivals, setSearchingRivals] =
    useState(false);

  const [sendingInvitation, setSendingInvitation] =
    useState(false);

  useEffect(() => {
    const intervalId =
      window.setInterval(() => {
        setNow(Date.now());
      }, 1000);

    return () => {
      window.clearInterval(
        intervalId,
      );
    };
  }, []);

  useEffect(() => {
    const cleanQuery =
      rivalQuery.trim();

    if (
      cleanQuery.length < 2 ||
      selectedRival
    ) {
      setRivalResults([]);
      setSearchingRivals(false);
      return;
    }

    let cancelled = false;

    const timeoutId =
      window.setTimeout(() => {
        void (async () => {
          setSearchingRivals(true);
          setActionError("");

          try {
            const {
              data: {
                user,
              },
              error: userError,
            } = await supabase.auth.getUser();

            if (userError || !user) {
              throw new Error(
                "Debes iniciar sesión para buscar un rival.",
              );
            }

            const {
              data,
              error: searchError,
            } = await supabase
              .from("profiles")
              .select(
                "id,username,full_name,avatar_url",
              )
              .neq("id", user.id)
              .ilike(
                "username",
                `%${cleanQuery}%`,
              )
              .limit(10);

            if (searchError) {
              throw new Error(
                `No se pudo buscar rivales: ${searchError.message}`,
              );
            }

            if (!cancelled) {
              setRivalResults(
                (data ??
                  []) as RivalSearchResult[],
              );
            }
          } catch (searchError) {
            if (!cancelled) {
              setRivalResults([]);
              setActionError(
                searchError instanceof Error
                  ? searchError.message
                  : "No se pudo buscar el rival.",
              );
            }
          } finally {
            if (!cancelled) {
              setSearchingRivals(false);
            }
          }
        })();
      }, 350);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [
    rivalQuery,
    selectedRival,
  ]);

  const handleSendInvitation =
    useCallback(async () => {
      if (!roomId) {
        setActionError(
          "Primero debes crear o iniciar una sala VYRO LIVE.",
        );
        return;
      }

      if (!selectedRival) {
        setActionError(
          "Selecciona un rival para enviar la invitación.",
        );
        return;
      }

      setSendingInvitation(true);
      setActionError("");

      try {
        await sendInvitation({
          roomId,
          receiverId:
            selectedRival.id,
          seriesConfig,
        });

        setSelectedRival(null);
        setRivalQuery("");
        setRivalResults([]);
      } catch (invitationError) {
        setActionError(
          invitationError instanceof Error
            ? invitationError.message
            : "No se pudo enviar la invitación de batalla.",
        );
      } finally {
        setSendingInvitation(false);
      }
    }, [
      roomId,
      selectedRival,
      sendInvitation,
      seriesConfig,
    ]);

  const activeReceived =
    useMemo(
      () =>
        received.filter(
          (invitation) =>
            invitation.status ===
              "pending" ||
            invitation.status ===
              "accepted",
        ),
      [received],
    );

  const activeSent =
    useMemo(
      () =>
        sent.filter(
          (invitation) =>
            invitation.status ===
              "pending" ||
            invitation.status ===
              "accepted",
        ),
      [sent],
    );

  const runAction = useCallback(
    async (
      invitationId: string,
      action: () => Promise<unknown>,
    ) => {
      setBusyId(invitationId);
      setActionError("");

      try {
        await action();
      } catch (invitationError) {
        setActionError(
          invitationError instanceof Error
            ? invitationError.message
            : "No se pudo procesar la invitación.",
        );
      } finally {
        setBusyId(null);
      }
    },
    [],
  );

  return (
    <section className="overflow-hidden rounded-[2rem] border border-fuchsia-400/20 bg-[#07111D] text-white shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
      <div className="border-b border-white/10 p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 text-fuchsia-300">
              <Mail size={22} />

              <p className="text-xs font-black uppercase tracking-[0.24em]">
                VYRO Battle Invitations
              </p>
            </div>

            <h2 className="mt-3 text-3xl font-black">
              Invitaciones de batalla
            </h2>

            <p className="mt-2 text-sm text-white/45">
              Acepta, rechaza o cancela invitaciones en tiempo real.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-black">
            <Radio
              size={16}
              className={
                connected
                  ? "text-emerald-300"
                  : "text-white/35"
              }
            />

            <span
              className={
                connected
                  ? "text-emerald-200"
                  : "text-white/45"
              }
            >
              {connected
                ? "Realtime conectado"
                : "Conectando Realtime"}
            </span>
          </div>
        </div>
      </div>

      <div className="border-b border-white/10 p-6 md:p-8">
        <div className="rounded-3xl border border-fuchsia-400/20 bg-fuchsia-500/[0.05] p-5">
          <div className="flex items-center gap-3 text-fuchsia-300">
            <Swords size={20} />

            <h3 className="font-black">
              Invitar rival
            </h3>
          </div>

          <p className="mt-2 text-sm text-white/45">
            Busca un usuario real de VYRO y envíale la configuración actual de esta Battle Series.
          </p>

          <div className="relative mt-5">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35"
            />

            <input
              type="search"
              value={rivalQuery}
              disabled={
                disabled ||
                sendingInvitation
              }
              onChange={(event) => {
                setRivalQuery(
                  event.target.value,
                );
                setSelectedRival(null);
              }}
              placeholder="Buscar rival por username..."
              className="w-full rounded-2xl border border-white/10 bg-black/20 py-3 pl-11 pr-4 font-bold text-white outline-none transition placeholder:text-white/25 focus:border-fuchsia-400/50 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {searchingRivals ? (
            <div className="mt-3 flex items-center gap-2 text-sm text-white/45">
              <LoaderCircle
                size={17}
                className="animate-spin"
              />
              Buscando usuarios...
            </div>
          ) : null}

          {!selectedRival &&
          rivalQuery.trim().length >= 2 &&
          !searchingRivals ? (
            <div className="mt-3 space-y-2">
              {rivalResults.length > 0 ? (
                rivalResults.map(
                  (rival) => (
                    <button
                      key={rival.id}
                      type="button"
                      disabled={
                        disabled ||
                        sendingInvitation
                      }
                      onClick={() => {
                        setSelectedRival(
                          rival,
                        );
                        setRivalQuery(
                          rival.username,
                        );
                        setRivalResults([]);
                      }}
                      className="flex w-full items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-left transition hover:border-fuchsia-400/40 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <div className="flex items-center gap-3">
                        <UserRound
                          size={20}
                          className="text-fuchsia-300"
                        />

                        <div>
                          <p className="font-black text-white">
                            {rival.full_name?.trim() ||
                              rival.username}
                          </p>

                          <p className="text-sm text-white/40">
                            @{rival.username}
                          </p>
                        </div>
                      </div>

                      <span className="text-xs font-black uppercase tracking-[0.16em] text-fuchsia-300">
                        Seleccionar
                      </span>
                    </button>
                  ),
                )
              ) : (
                <p className="rounded-2xl border border-dashed border-white/10 p-4 text-sm text-white/40">
                  No encontramos usuarios con ese username.
                </p>
              )}
            </div>
          ) : null}

          {selectedRival ? (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/[0.06] p-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                  Rival seleccionado
                </p>

                <p className="mt-1 font-black text-white">
                  {selectedRival.full_name?.trim() ||
                    selectedRival.username}
                </p>

                <p className="text-sm text-white/40">
                  @{selectedRival.username}
                </p>
              </div>

              <button
                type="button"
                disabled={
                  disabled ||
                  sendingInvitation ||
                  !roomId
                }
                onClick={() => {
                  void handleSendInvitation();
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-fuchsia-400 px-5 py-3 font-black text-black transition hover:bg-fuchsia-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {sendingInvitation ? (
                  <LoaderCircle
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <Send size={18} />
                )}

                {sendingInvitation
                  ? "Enviando..."
                  : "Enviar invitación Battle"}
              </button>
            </div>
          ) : null}

          {!roomId ? (
            <p className="mt-4 text-sm font-bold text-amber-200">
              Inicia una sala VYRO LIVE para poder enviar invitaciones Battle.
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 p-6 md:p-8 lg:grid-cols-2">
        <div>
          <div className="flex items-center gap-3 text-cyan-300">
            <Swords size={20} />

            <h3 className="font-black">
              Recibidas
            </h3>
          </div>

          <div className="mt-4 space-y-4">
            {loading ? (
              <div className="rounded-3xl border border-white/10 p-8 text-center">
                <LoaderCircle className="mx-auto animate-spin text-cyan-300" />

                <p className="mt-3 text-sm text-white/45">
                  Cargando invitaciones...
                </p>
              </div>
            ) : activeReceived.length >
              0 ? (
              activeReceived.map(
                (invitation) => (
                  <InvitationCard
                    key={invitation.id}
                    invitation={
                      invitation
                    }
                    direction="received"
                    now={now}
                    busy={
                      busyId ===
                      invitation.id
                    }
                    onAccept={() => {
                      void runAction(
                        invitation.id,
                        () =>
                          acceptInvitation(
                            invitation.id,
                          ),
                      );
                    }}
                    onDecline={() => {
                      void runAction(
                        invitation.id,
                        () =>
                          declineInvitation(
                            invitation.id,
                          ),
                      );
                    }}
                  />
                ),
              )
            ) : (
              <div className="rounded-3xl border border-dashed border-white/10 p-8 text-center text-sm text-white/40">
                No tienes invitaciones recibidas activas.
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 text-violet-300">
            <Send size={20} />

            <h3 className="font-black">
              Enviadas
            </h3>
          </div>

          <div className="mt-4 space-y-4">
            {loading ? (
              <div className="rounded-3xl border border-white/10 p-8 text-center">
                <LoaderCircle className="mx-auto animate-spin text-violet-300" />
              </div>
            ) : activeSent.length > 0 ? (
              activeSent.map(
                (invitation) => (
                  <InvitationCard
                    key={invitation.id}
                    invitation={
                      invitation
                    }
                    direction="sent"
                    now={now}
                    busy={
                      busyId ===
                      invitation.id
                    }
                    onCancel={() => {
                      void runAction(
                        invitation.id,
                        () =>
                          cancelInvitation(
                            invitation.id,
                          ),
                      );
                    }}
                  />
                ),
              )
            ) : (
              <div className="rounded-3xl border border-dashed border-white/10 p-8 text-center text-sm text-white/40">
                No tienes invitaciones enviadas activas.
              </div>
            )}
          </div>
        </div>
      </div>

      {error || actionError ? (
        <div
          role="alert"
          className="mx-6 mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200 md:mx-8 md:mb-8"
        >
          {actionError || error}
        </div>
      ) : null}
    </section>
  );
}

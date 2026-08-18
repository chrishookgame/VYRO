"use client";

import {
  Maximize2,
  Mic,
  MicOff,
  Minimize2,
  MoreVertical,
  Move,
  Video,
  VideoOff,
} from "lucide-react";

import {
  RoomEvent,
  Track,
  type RemoteParticipant,
  type Room,
} from "livekit-client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  UseLiveGuestInvitationsResult,
} from "@/hooks/useLiveGuestInvitations";

type VyroGuestCanvasStageProps = {
  room: Room | null;
  roomId: string | null;
  isLive: boolean;
  guestInvitations: UseLiveGuestInvitationsResult;
  maxGuests?: number;
  layoutMode?: "two" | "three" | "free";
};

type GuestMedia = {
  participant: RemoteParticipant;
  identity: string;
  camera: boolean;
  microphone: boolean;
  cameraTrackSid: string | null;
  microphoneTrackSid: string | null;
};

type GuestPosition = {
  x: number;
  y: number;
  width?: number;
};

type GuestResizeStart = {
  pointerX: number;
  width: number;
};

function GuestCanvasVideo({
  participant,
}: {
  participant: RemoteParticipant;
}) {
  const [
    videoElement,
    setVideoElement,
  ] = useState<HTMLVideoElement | null>(null);

  const cameraPublication =
    participant.getTrackPublication(
      Track.Source.Camera,
    );

  const cameraTrack =
    cameraPublication?.track ?? null;

  useEffect(() => {
    if (!videoElement || !cameraTrack) {
      return;
    }

    cameraTrack.attach(videoElement);

    return () => {
      cameraTrack.detach(videoElement);
    };
  }, [
    cameraTrack,
    videoElement,
  ]);

  const cameraAvailable =
    Boolean(
      cameraPublication &&
        cameraTrack &&
        !cameraPublication.isMuted,
    );

  return (
    <div className="absolute inset-0">
      {cameraAvailable ? (
        <video
          ref={setVideoElement}
          autoPlay
          playsInline
          muted
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-black/35 backdrop-blur-sm">
          <VideoOff
            size={22}
            className="text-white/35"
          />
        </div>
      )}
    </div>
  );
}

export function VyroGuestCanvasStage({
  room,
  roomId,
  isLive,
  guestInvitations,
  maxGuests = 10,
  layoutMode = "two",
}: VyroGuestCanvasStageProps) {
  const [
    remoteParticipants,
    setRemoteParticipants,
  ] = useState<RemoteParticipant[]>([]);

  const [
    focusedGuestIdentity,
    setFocusedGuestIdentity,
  ] = useState<string | null>(null);

  const [
    openGuestMenuIdentity,
    setOpenGuestMenuIdentity,
  ] = useState<string | null>(null);

  const [
    positions,
    setPositions,
  ] = useState<Record<string, GuestPosition>>({});

  const [
    resizingIdentity,
    setResizingIdentity,
  ] = useState<string | null>(null);

  const [
    resizeStart,
    setResizeStart,
  ] = useState<GuestResizeStart | null>(null);

  const [
    draggingIdentity,
    setDraggingIdentity,
  ] = useState<string | null>(null);

  const [
    dragStart,
    setDragStart,
  ] = useState<{
    pointerX: number;
    pointerY: number;
    x: number;
    y: number;
  } | null>(null);

  const safeMaxGuests =
    Math.min(
      10,
      Math.max(0, maxGuests),
    );

  useEffect(() => {
    if (!room || !isLive) {
      setRemoteParticipants([]);
      return;
    }

    const syncParticipants = () => {
      setRemoteParticipants(
        Array.from(
          room.remoteParticipants.values(),
        ),
      );
    };

    syncParticipants();

    room.on(
      RoomEvent.ParticipantConnected,
      syncParticipants,
    );

    room.on(
      RoomEvent.ParticipantDisconnected,
      syncParticipants,
    );

    room.on(
      RoomEvent.TrackPublished,
      syncParticipants,
    );

    room.on(
      RoomEvent.TrackUnpublished,
      syncParticipants,
    );

    room.on(
      RoomEvent.TrackMuted,
      syncParticipants,
    );

    room.on(
      RoomEvent.TrackUnmuted,
      syncParticipants,
    );

    return () => {
      room.off(
        RoomEvent.ParticipantConnected,
        syncParticipants,
      );

      room.off(
        RoomEvent.ParticipantDisconnected,
        syncParticipants,
      );

      room.off(
        RoomEvent.TrackPublished,
        syncParticipants,
      );

      room.off(
        RoomEvent.TrackUnpublished,
        syncParticipants,
      );

      room.off(
        RoomEvent.TrackMuted,
        syncParticipants,
      );

      room.off(
        RoomEvent.TrackUnmuted,
        syncParticipants,
      );
    };
  }, [
    isLive,
    room,
  ]);

  const guestMedia =
    useMemo<GuestMedia[]>(
      () =>
        remoteParticipants
          .filter(
            (participant) =>
              participant.identity.startsWith(
                "guest:",
              ),
          )
          .map((participant) => {
            const cameraPublication =
              participant.getTrackPublication(
                Track.Source.Camera,
              );

            const microphonePublication =
              participant.getTrackPublication(
                Track.Source.Microphone,
              );

            return {
              participant,
              identity:
                participant.identity,
              camera:
                Boolean(
                  cameraPublication &&
                    cameraPublication.track &&
                    !cameraPublication.isMuted,
                ),
              microphone:
                Boolean(
                  microphonePublication &&
                    microphonePublication.track &&
                    !microphonePublication.isMuted,
                ),
              cameraTrackSid:
                cameraPublication?.trackSid ??
                null,
              microphoneTrackSid:
                microphonePublication?.trackSid ??
                null,
            };
          }),
      [remoteParticipants],
    );

  const onStageGuests =
    useMemo(
      () =>
        guestInvitations.sent
          .filter(
            (invitation) =>
              invitation.roomId ===
                (room?.name ?? "") &&
              invitation.status ===
                "accepted" &&
              invitation.stageStatus ===
                "on_stage",
          )
          .slice(
            0,
            safeMaxGuests,
          )
          .map((invitation) => {
            const identity =
              `guest:${invitation.guestId}`;

            const media =
              guestMedia.find(
                (candidate) =>
                  candidate.identity ===
                  identity,
              ) ?? null;

            return {
              invitationId: invitation.id,
              identity,
              name:
                invitation.guest?.full_name ??
                invitation.guest?.username ??
                media?.participant.name ??
                "VYRO Guest",
              media,
            };
          }),
      [
        guestInvitations.sent,
        guestMedia,
        room?.name,
        safeMaxGuests,
      ],
    );

  useEffect(() => {
    if (
      focusedGuestIdentity &&
      !onStageGuests.some(
        (guest) =>
          guest.identity ===
          focusedGuestIdentity,
      )
    ) {
      setFocusedGuestIdentity(null);
    }
  }, [
    focusedGuestIdentity,
    onStageGuests,
  ]);


  const controlGuestMedia = async (
    guestIdentity: string,
    trackSid: string | null,
    media: "camera" | "microphone",
    muted: boolean,
  ) => {
    if (!roomId || !trackSid) {
      return false;
    }

    try {
      const response = await fetch("/api/live/guest/media-control", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId,
          guestIdentity,
          trackSid,
          media,
          muted,
        }),
      });

      if (!response.ok) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  };

  if (!isLive) {
    return null;
  }

  const focusedGuest =
    focusedGuestIdentity
      ? onStageGuests.find(
          (guest) =>
            guest.identity ===
            focusedGuestIdentity,
        ) ?? null
      : null;

  const defaultPosition = (
    index: number,
  ): GuestPosition => {
    if (layoutMode !== "free") {
      const columns =
        layoutMode === "three" ? 3 : 2;

      const column = index % columns;
      const row = Math.floor(index / columns);

      return {
        x:
          columns === 3
            ? [18, 50, 82][column]
            : (safeMaxGuests >= 7 ? [77, 90][column] : [75, 90][column]),
        y:
          4 +
          row *
            (columns === 3 ? 20 : (safeMaxGuests >= 7 ? 15.6 : 18)),
        width:
          columns === 3 ? 20 : (safeMaxGuests >= 7 ? 13 : 15),
      };
    }

    const layouts: Record<
      number,
      GuestPosition[]
    > = {
      1: [
        { x: 78, y: 8, width: 28 },
      ],
      2: [
        { x: 70, y: 8, width: 26 },
        { x: 86, y: 38, width: 26 },
      ],
      3: [
        { x: 69, y: 7, width: 24 },
        { x: 85, y: 35, width: 24 },
        { x: 69, y: 63, width: 24 },
      ],
      4: [
        { x: 68, y: 6, width: 23 },
        { x: 84, y: 6, width: 23 },
        { x: 68, y: 43, width: 23 },
        { x: 84, y: 43, width: 23 },
      ],
      5: [
        { x: 61, y: 6, width: 21 },
        { x: 77, y: 6, width: 21 },
        { x: 90, y: 6, width: 18 },
        { x: 69, y: 46, width: 21 },
        { x: 85, y: 46, width: 21 },
      ],
      6: [
        { x: 60, y: 6, width: 20 },
        { x: 76, y: 6, width: 20 },
        { x: 90, y: 6, width: 18 },
        { x: 60, y: 46, width: 20 },
        { x: 76, y: 46, width: 20 },
        { x: 90, y: 46, width: 18 },
      ],
      7: [
        { x: 53, y: 5, width: 18 },
        { x: 68, y: 5, width: 18 },
        { x: 83, y: 5, width: 18 },
        { x: 94, y: 5, width: 15 },
        { x: 61, y: 47, width: 18 },
        { x: 76, y: 47, width: 18 },
        { x: 91, y: 47, width: 16 },
      ],
      8: [
        { x: 52, y: 5, width: 17 },
        { x: 66, y: 5, width: 17 },
        { x: 80, y: 5, width: 17 },
        { x: 93, y: 5, width: 15 },
        { x: 52, y: 47, width: 17 },
        { x: 66, y: 47, width: 17 },
        { x: 80, y: 47, width: 17 },
        { x: 93, y: 47, width: 15 },
      ],
      9: [
        { x: 48, y: 4, width: 16 },
        { x: 61, y: 4, width: 16 },
        { x: 74, y: 4, width: 16 },
        { x: 87, y: 4, width: 16 },
        { x: 48, y: 45, width: 16 },
        { x: 61, y: 45, width: 16 },
        { x: 74, y: 45, width: 16 },
        { x: 87, y: 45, width: 16 },
        { x: 94, y: 65, width: 14 },
      ],
      10: [
        { x: 46, y: 4, width: 15 },
        { x: 58, y: 4, width: 15 },
        { x: 70, y: 4, width: 15 },
        { x: 82, y: 4, width: 15 },
        { x: 94, y: 4, width: 13 },
        { x: 46, y: 45, width: 15 },
        { x: 58, y: 45, width: 15 },
        { x: 70, y: 45, width: 15 },
        { x: 82, y: 45, width: 15 },
        { x: 94, y: 45, width: 13 },
      ],
    };

    return (
      layouts[safeMaxGuests]?.[index] ?? {
        x: 78,
        y: 8,
        width: 23,
      }
    );
  };

  return (
    <div
      className="
        pointer-events-none
        absolute inset-x-2
        bottom-[68px] top-[72px]
        z-20
        overflow-hidden
        sm:inset-x-3
        sm:bottom-[72px]
        sm:top-[74px]
      "
      onPointerMove={(event) => {
        const parent =
          event.currentTarget
            .getBoundingClientRect();

        if (
          resizingIdentity &&
          resizeStart
        ) {
          const deltaWidth =
            ((event.clientX -
              resizeStart.pointerX) /
              parent.width) *
            100;

          setPositions(
            (current) => {
              const existing =
                current[resizingIdentity] ??
                {
                  x: 50,
                  y: 10,
                };

              return {
                ...current,
                [resizingIdentity]: {
                  ...existing,
                  width: Math.min(
                    55,
                    Math.max(
                      16,
                      resizeStart.width +
                        deltaWidth,
                    ),
                  ),
                },
              };
            },
          );

          return;
        }

        if (
          !draggingIdentity ||
          !dragStart
        ) {
          return;
        }

        const deltaX =
          ((event.clientX -
            dragStart.pointerX) /
            parent.width) *
          100;

        const deltaY =
          ((event.clientY -
            dragStart.pointerY) /
            parent.height) *
          100;

        setPositions(
          (current) => ({
            ...current,
            [draggingIdentity]: {
              ...current[draggingIdentity],
              x: Math.min(
                88,
                Math.max(
                  2,
                  dragStart.x +
                    deltaX,
                ),
              ),
              y: Math.min(
                78,
                Math.max(
                  2,
                  dragStart.y +
                    deltaY,
                ),
              ),
            },
          }),
        );
      }}
      onPointerUp={() => {
        setDraggingIdentity(null);
        setDragStart(null);
        setResizingIdentity(null);
        setResizeStart(null);
      }}
      onPointerCancel={() => {
        setDraggingIdentity(null);
        setDragStart(null);
        setResizingIdentity(null);
        setResizeStart(null);
      }}
    >
      {focusedGuest ? (
        <div
          className="
            pointer-events-auto
            absolute inset-1
            overflow-hidden
            rounded-[1.5rem]
            border border-fuchsia-300/70
            bg-black/15
            shadow-[0_22px_80px_rgba(0,0,0,0.5)]
            backdrop-blur-[1px]
            sm:inset-2
          "
        >
          {focusedGuest.media ? (
            <GuestCanvasVideo
              participant={
                focusedGuest.media
                  .participant
              }
            />
          ) : null}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/15" />

          <div className="absolute left-3 top-3 rounded-full border border-fuchsia-300/30 bg-black/45 px-3 py-1.5 backdrop-blur-xl">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white">
              {focusedGuest.name}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setFocusedGuestIdentity(
                null,
              );
            }}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white backdrop-blur-xl transition hover:bg-white/15"
            title="Volver al layout"
          >
            <Minimize2 size={16} />
          </button>
        </div>
      ) : (
        <>
          {Array.from({
            length: safeMaxGuests,
          }).map((_, index) => {
            const guest =
              onStageGuests[index];

            if (guest) {
              return null;
            }

            const position =
              defaultPosition(index);

            return (
              <div
                key={`empty-stage-slot-${index}`}
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                  width: `${position.width ?? 23}%`,
                }}
                className="
                  pointer-events-none
                  absolute
                  min-w-[78px]
                  max-w-[48%]
                  -translate-x-1/2
                  overflow-hidden
                  rounded-xl
                  border
                  border-dashed
                  border-cyan-300/35
                  bg-black/35
                  backdrop-blur-md
                "
              >
                <div className="relative aspect-[4/3]">
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-black/25 via-black/35 to-cyan-950/25">
                    <VideoOff
                      size={18}
                      className="text-cyan-100/30"
                    />

                    <span className="text-[8px] font-black uppercase tracking-[0.16em] text-cyan-100/45">
                      Guest {index + 1}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {onStageGuests.map(
          (guest, index) => {
            const position =
              positions[
                guest.identity
              ] ??
              defaultPosition(
                index,
              );

            return (
              <article
                key={guest.identity}
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                  width: `${position.width ?? 23}%`,
                }}
                className="
                  pointer-events-auto
                  group
                  absolute
                  min-w-[78px]
                  max-w-[48%]
                  -translate-x-1/2
                  overflow-hidden
                  rounded-xl
                  border border-cyan-300/60
                  bg-black/35
                  shadow-[0_14px_36px_rgba(0,0,0,0.42)]
                  backdrop-blur-md
                "
              >
                <div className="relative aspect-[4/3]">
                  {guest.media ? (
                    <GuestCanvasVideo
                      participant={
                        guest.media
                          .participant
                      }
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <VideoOff
                        size={20}
                        className="text-white/30"
                      />
                    </div>
                  )}

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/10" />

                  <button
                    type="button"
                    onPointerDown={(
                      event,
                    ) => {
                      event.currentTarget.setPointerCapture(
                        event.pointerId,
                      );

                      setDraggingIdentity(
                        guest.identity,
                      );

                      setDragStart({
                        pointerX:
                          event.clientX,
                        pointerY:
                          event.clientY,
                        x:
                          position.x,
                        y:
                          position.y,
                      });
                    }}
                    className="absolute left-2 top-2 flex h-7 w-7 touch-none items-center justify-center rounded-full border border-white/10 bg-black/50 text-white/75 backdrop-blur-xl"
                    title="Mover Guest"
                  >
                    <Move size={13} />
                  </button>

                  <div className="absolute right-2 top-2 z-30">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();

                        setOpenGuestMenuIdentity(
                          (currentIdentity) =>
                            currentIdentity ===
                            guest.identity
                              ? null
                              : guest.identity,
                        );
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-cyan-300/35 bg-black/65 text-cyan-100 shadow-lg backdrop-blur-xl transition hover:border-cyan-200/70 hover:bg-cyan-400/15"
                      title={`Controles de ${guest.name}`}
                      aria-label={`Abrir controles de ${guest.name}`}
                      aria-expanded={
                        openGuestMenuIdentity ===
                        guest.identity
                      }
                    >
                      <span className="text-base font-black leading-none">
                        +
                      </span>
                    </button>

                    {openGuestMenuIdentity ===
                    guest.identity ? (
                      <div
                        className="absolute right-0 top-9 w-44 overflow-hidden rounded-xl border border-cyan-300/25 bg-slate-950/95 p-1.5 shadow-2xl backdrop-blur-2xl"
                        onClick={(event) => {
                          event.stopPropagation();
                        }}
                      >
                        <div className="mb-1 flex items-center justify-between gap-2 border-b border-white/10 px-2 py-2">
                          <div className="min-w-0">
                            <p className="truncate text-[10px] font-black text-white">
                              {guest.name}
                            </p>

                            <p className="text-[8px] font-black uppercase tracking-[0.14em] text-cyan-300">
                              Guest {index + 1}
                            </p>
                          </div>

                          <MoreVertical
                            size={14}
                            className="shrink-0 text-cyan-200/70"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={async () => {
                            await guestInvitations.returnGuestToWaiting(
                              guest.invitationId,
                            );

                            setOpenGuestMenuIdentity(
                              null,
                            );
                          }}
                          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[10px] font-bold text-white transition hover:bg-amber-300/10"
                        >
                          <Minimize2
                            size={14}
                            className="text-amber-300"
                          />

                          Enviar a Waiting
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            await guestInvitations.revokeInvitation(
                              guest.invitationId,
                            );

                            setOpenGuestMenuIdentity(
                              null,
                            );
                          }}
                          className="mt-1 flex w-full items-center gap-2 rounded-lg border border-red-400/15 bg-red-500/[0.06] px-2.5 py-2 text-left text-[10px] font-bold text-red-200 transition hover:border-red-300/30 hover:bg-red-500/15"
                        >
                          <span className="flex h-4 w-4 items-center justify-center rounded-full border border-red-300/30 text-[10px] font-black text-red-300">
                            ×
                          </span>

                          Retirar Guest
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setFocusedGuestIdentity(
                              guest.identity,
                            );

                            setOpenGuestMenuIdentity(
                              null,
                            );
                          }}
                          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[10px] font-bold text-white transition hover:bg-white/10"
                        >
                          <Maximize2
                            size={14}
                            className="text-cyan-300"
                          />

                          Pantalla grande
                        </button>

                        <div className="mt-1 grid grid-cols-2 gap-1 border-t border-white/10 pt-1.5">
                          <button
                            type="button"
                            disabled={!guest.media?.cameraTrackSid}
                            onClick={async () => {
                              if (!guest.media) {
                                return;
                              }

                              await controlGuestMedia(
                                guest.identity,
                                guest.media.cameraTrackSid,
                                "camera",
                                guest.media.camera,
                              );
                            }}
                            className="flex items-center gap-1.5 rounded-lg bg-white/5 px-2 py-2 text-left transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                            title={
                              guest.media?.camera
                                ? "Apagar cámara"
                                : "Activar cámara"
                            }
                            aria-label={
                              guest.media?.camera
                                ? `Apagar cámara de ${guest.name}`
                                : `Activar cámara de ${guest.name}`
                            }
                          >
                            {guest.media?.camera ? (
                              <Video
                                size={13}
                                className="text-emerald-300"
                              />
                            ) : (
                              <VideoOff
                                size={13}
                                className="text-red-300"
                              />
                            )}

                            <span className="text-[8px] font-black uppercase text-white/70">
                              Cámara
                            </span>
                          </button>

                          <button
                            type="button"
                            disabled={!guest.media?.microphoneTrackSid}
                            onClick={async () => {
                              if (!guest.media) {
                                return;
                              }

                              await controlGuestMedia(
                                guest.identity,
                                guest.media.microphoneTrackSid,
                                "microphone",
                                guest.media.microphone,
                              );
                            }}
                            className="flex items-center gap-1.5 rounded-lg bg-white/5 px-2 py-2 text-left transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                            title={
                              guest.media?.microphone
                                ? "Silenciar micrófono"
                                : "Activar micrófono"
                            }
                            aria-label={
                              guest.media?.microphone
                                ? `Silenciar micrófono de ${guest.name}`
                                : `Activar micrófono de ${guest.name}`
                            }
                          >
                            {guest.media?.microphone ? (
                              <Mic
                                size={13}
                                className="text-emerald-300"
                              />
                            ) : (
                              <MicOff
                                size={13}
                                className="text-red-300"
                              />
                            )}

                            <span className="text-[8px] font-black uppercase text-white/70">
                              Mic
                            </span>
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    onPointerDown={(event) => {
                      event.preventDefault();
                      event.stopPropagation();

                      event.currentTarget.setPointerCapture(
                        event.pointerId,
                      );

                      setDraggingIdentity(null);
                      setDragStart(null);

                      setResizingIdentity(
                        guest.identity,
                      );

                      setResizeStart({
                        pointerX:
                          event.clientX,
                        width:
                          position.width ??
                          23,
                      });
                    }}
                    className="absolute bottom-1.5 right-1.5 z-20 h-5 w-5 touch-none cursor-se-resize rounded-br-xl border-b-2 border-r-2 border-cyan-200/80 opacity-60 transition hover:opacity-100"
                    title="Cambiar tamaño"
                    aria-label={`Cambiar tamaño de ${guest.name}`}
                  />

                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 px-2.5 pb-2 pt-8">
                    <div className="min-w-0">
                      <p className="truncate text-[10px] font-black text-white sm:text-xs">
                        {guest.name}
                      </p>

                      <p className="text-[8px] font-black uppercase tracking-[0.14em] text-cyan-300">
                        Guest {index + 1}
                      </p>
                    </div>

                    <div className="flex shrink-0 gap-1">
                      {guest.media
                        ?.microphone ? (
                        <Mic
                          size={11}
                          className="text-emerald-300"
                        />
                      ) : (
                        <MicOff
                          size={11}
                          className="text-red-300"
                        />
                      )}

                      {guest.media
                        ?.camera ? (
                        <Video
                          size={11}
                          className="text-cyan-300"
                        />
                      ) : (
                        <VideoOff
                          size={11}
                          className="text-red-300"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          },
        )}

        </>
      )}
    </div>
  );
}

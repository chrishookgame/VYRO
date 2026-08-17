"use client";

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

import type { UseLiveGuestInvitationsResult } from "@/hooks/useLiveGuestInvitations";
import {
  DEFAULT_VYRO_PRESENTATION_STATE,
  encodeVyroPresentation,
  VYRO_PRESENTATION_TOPIC,
  type VyroLivePresentationState,
  type VyroLiveScene,
} from "@/lib/live/presentation/protocol";

type CreatorOnAirOverlay = {
  visible: boolean;
  eyebrow: string;
  title: string;
  message: string;
  cta: string;
};

type LiveProductionPanelProps = {
  room: Room | null;
  isLive: boolean;
  guestInvitations: UseLiveGuestInvitationsResult;
  onPublishedOverlayChange?: (
    overlay: CreatorOnAirOverlay,
  ) => void;
  onStageMaxGuestsChange?: (maxGuests: number) => void;
};

function createPresentationTimestamp() {
  return new Date().getTime();
}

const sceneOptions: {
  id: VyroLiveScene;
  name: string;
  description: string;
}[] = [
  {
    id: "focus",
    name: "Focus",
    description:
      "Creador protagonista a pantalla completa.",
  },
  {
    id: "cinema",
    name: "Cinema",
    description:
      "Composición amplia para contenido y pantalla.",
  },
  {
    id: "portrait",
    name: "Portrait",
    description:
      "Presentación vertical centrada.",
  },
  {
    id: "spotlight",
    name: "Spotlight",
    description:
      "Momento especial con presencia visual reforzada.",
  },
];

function GuestVideoPreview({
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
    if (
      !videoElement ||
      !cameraTrack
    ) {
      return;
    }

    cameraTrack.attach(
      videoElement,
    );

    return () => {
      cameraTrack.detach(
        videoElement,
      );
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
    <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black">
      {cameraAvailable ? (
        <video
          ref={setVideoElement}
          autoPlay
          playsInline
          muted
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full items-center justify-center px-4 text-center">
          <div>
            <p className="text-sm font-black text-white/50">
              Cámara no disponible
            </p>

            <p className="mt-1 text-xs text-white/30">
              Esperando video del Guest.
            </p>
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-4 pb-3 pt-10">
        <p className="truncate text-sm font-black text-white">
          {participant.name ||
            participant.identity}
        </p>

        <p className="mt-0.5 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-300">
          VYRO GUEST
        </p>
      </div>
    </div>
  );
}
export function LiveProductionPanel({
  room,
  isLive,
  guestInvitations,
  onPublishedOverlayChange,
  onStageMaxGuestsChange,
}: LiveProductionPanelProps) {
  const {
    sent: sentInvitations,
    putGuestOnStage,
    returnGuestToWaiting,
    revokeInvitation,
  } = guestInvitations;

  const [
    guestStageBusyId,
    setGuestStageBusyId,
  ] = useState<string | null>(null);

  const [
    guestStageStatus,
    setGuestStageStatus,
  ] = useState("");

  const [scene, setScene] =
    useState<VyroLiveScene>("focus");

  const [eyebrow, setEyebrow] =
    useState("");

  const [title, setTitle] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [cta, setCta] =
    useState("");

  const [overlayVisible, setOverlayVisible] =
    useState(false);

  const [stageEnabled, setStageEnabled] =
    useState(false);

  const [stageMaxGuests, setStageMaxGuests] = useState(10);

  const [stageLayout, setStageLayout] =
    useState<"auto" | "grid" | "spotlight">(
      "auto",
    );

  const [stageHostMode, setStageHostMode] =
    useState<"fullscreen" | "window" | "pip">(
      "fullscreen",
    );

  const [stagePanelOpen, setStagePanelOpen] =
    useState(false);

  const activeStageRoomId =
    room?.name ?? "";

  const acceptedStageInvitations =
    useMemo(
      () =>
        sentInvitations.filter(
          (invitation) =>
            invitation.roomId ===
              activeStageRoomId &&
            invitation.status ===
              "accepted",
        ),
      [
        activeStageRoomId,
        sentInvitations,
      ],
    );

  const waitingGuestInvitations =
    useMemo(
      () =>
        acceptedStageInvitations.filter(
          (invitation) =>
            invitation.stageStatus ===
              "waiting",
        ),
      [acceptedStageInvitations],
    );

  const onStageGuestInvitations =
    useMemo(
      () =>
        acceptedStageInvitations.filter(
          (invitation) =>
            invitation.stageStatus ===
              "on_stage",
        ),
      [acceptedStageInvitations],
    );

  const stageHasCapacity =
    onStageGuestInvitations.length <
    stageMaxGuests;

  const [freeCameraEnabled, setFreeCameraEnabled] =
    useState(false);

  const [freeCameraX, setFreeCameraX] =
    useState(0);

  const [freeCameraY, setFreeCameraY] =
    useState(0);

  const [freeCameraZoom, setFreeCameraZoom] =
    useState(1);

  async function moveGuestToStage(
    invitationId: string,
  ) {
    if (!stageEnabled) {
      setGuestStageStatus(
        "Abre VYRO Stage antes de subir invitados.",
      );
      return;
    }

    if (!stageHasCapacity) {
      setGuestStageStatus(
        `Stage completo: máximo ${stageMaxGuests} invitados.`,
      );
      return;
    }

    setGuestStageBusyId(
      invitationId,
    );

    setGuestStageStatus("");

    try {
      await putGuestOnStage(
        invitationId,
      );

      setGuestStageStatus(
        "Guest subido al Stage.",
      );
    }
    catch (guestStageError) {
      console.error(
        "VYRO put Guest on Stage error:",
        guestStageError,
      );

      setGuestStageStatus(
        guestStageError instanceof Error
          ? guestStageError.message
          : "No fue posible subir el Guest al Stage.",
      );
    }
    finally {
      setGuestStageBusyId(null);
    }
  }

  async function moveGuestToWaiting(
    invitationId: string,
  ) {
    setGuestStageBusyId(
      invitationId,
    );

    setGuestStageStatus("");

    try {
      await returnGuestToWaiting(
        invitationId,
      );

      setGuestStageStatus(
        "Guest devuelto a Waiting Room.",
      );
    }
    catch (guestStageError) {
      console.error(
        "VYRO return Guest to Waiting error:",
        guestStageError,
      );

      setGuestStageStatus(
        guestStageError instanceof Error
          ? guestStageError.message
          : "No fue posible bajar el Guest.",
      );
    }
    finally {
      setGuestStageBusyId(null);
    }
  }

  async function removeStageGuest(
    invitationId: string,
  ) {
    setGuestStageBusyId(
      invitationId,
    );

    setGuestStageStatus("");

    try {
      await revokeInvitation(
        invitationId,
      );

      setGuestStageStatus(
        "Acceso Guest retirado.",
      );
    }
    catch (guestStageError) {
      console.error(
        "VYRO revoke Guest error:",
        guestStageError,
      );

      setGuestStageStatus(
        guestStageError instanceof Error
          ? guestStageError.message
          : "No fue posible retirar el Guest.",
      );
    }
    finally {
      setGuestStageBusyId(null);
    }
  }

  const [publishing, setPublishing] =
    useState(false);

  const [status, setStatus] =
    useState("");

  const [
    autoDirectorEnabled,
    setAutoDirectorEnabled,
  ] = useState(false);

  const [
    remoteParticipants,
    setRemoteParticipants,
  ] = useState<RemoteParticipant[]>([]);

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

  const guestParticipants =
    useMemo(
      () =>
        remoteParticipants
          .filter(
            (participant) =>
              participant.identity.startsWith(
                "guest:",
              ),
          )
          .map(
          (participant) => {
            const cameraPublication =
              participant.getTrackPublication(
                Track.Source.Camera,
              );

            const microphonePublication =
              participant.getTrackPublication(
                Track.Source.Microphone,
              );

            const screenPublication =
              participant.getTrackPublication(
                Track.Source.ScreenShare,
              );

            return {
              participant,
              identity: participant.identity,
              name:
                participant.name ||
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
              screen:
                Boolean(
                  screenPublication &&
                    screenPublication.track &&
                    !screenPublication.isMuted,
                ),
            };
          },
        ),
      [remoteParticipants],
    );
  const canPublish =
    isLive && room !== null;

  const autoDirectorScene =
    useMemo<VyroLiveScene>(() => {
      const guestSharingScreen =
        guestParticipants.some(
          (participant) =>
            participant.screen,
        );

      if (guestSharingScreen) {
        return "spotlight";
      }

      if (guestParticipants.length > 0) {
        return "cinema";
      }

      return "focus";
    }, [guestParticipants]);

  const preview =
    useMemo(
      () => ({
        eyebrow: eyebrow.trim(),
        title: title.trim(),
        message: message.trim(),
        cta: cta.trim(),
      }),
      [
        cta,
        eyebrow,
        message,
        title,
      ],
    );

  async function publishState(
    overrides?: Partial<{
      scene: VyroLiveScene;
      overlayVisible: boolean;
    }>,
  ) {
    if (!room || !isLive) {
      setStatus(
        "Inicia VYRO LIVE para publicar cambios.",
      );
      return;
    }

    const nextScene =
      overrides?.scene ?? scene;

    const nextOverlayVisible =
      overrides?.overlayVisible ??
      overlayVisible;

    const state:
      VyroLivePresentationState = {
        ...DEFAULT_VYRO_PRESENTATION_STATE,
        scene: nextScene,
        stage: {
          enabled: stageEnabled,
          maxGuests: stageMaxGuests,
          layout: stageLayout,
          hostMode: stageHostMode,
        },
        freeCamera: {
          enabled: freeCameraEnabled,
          x: freeCameraX,
          y: freeCameraY,
          zoom: freeCameraZoom,
        },
        overlay: {
          visible:
            nextOverlayVisible,
          eyebrow: preview.eyebrow,
          title: preview.title,
          message: preview.message,
          cta: preview.cta,
        },
        sentAt: createPresentationTimestamp(),
      };

    setPublishing(true);
    setStatus("");

    try {
      await room.localParticipant.publishData(
        encodeVyroPresentation(state),
        {
          reliable: true,
          topic:
            VYRO_PRESENTATION_TOPIC,
        },
      );

      onPublishedOverlayChange?.({
        visible: nextOverlayVisible,
        eyebrow: preview.eyebrow,
        title: preview.title,
        message: preview.message,
        cta: preview.cta,
      });

      setStatus(
        "Presentación sincronizada con VYRO LIVE.",
      );
    }
    catch (publishError) {
      console.error(
        "VYRO presentation publish error:",
        publishError,
      );

      setStatus(
        "No fue posible actualizar la presentación.",
      );
    }
    finally {
      setPublishing(false);
    }
  }

  useEffect(() => {
    if (
      !autoDirectorEnabled ||
      !room ||
      !isLive ||
      scene === autoDirectorScene
    ) {
      return;
    }

    const activeRoom = room;
    let cancelled = false;

    async function directProduction() {
      const state:
        VyroLivePresentationState = {
          ...DEFAULT_VYRO_PRESENTATION_STATE,
          scene: autoDirectorScene,
          stage: {
            enabled: stageEnabled,
            maxGuests: stageMaxGuests,
            layout: stageLayout,
            hostMode: stageHostMode,
          },
          freeCamera: {
            enabled: freeCameraEnabled,
            x: freeCameraX,
            y: freeCameraY,
            zoom: freeCameraZoom,
          },
          overlay: {
            visible: overlayVisible,
            eyebrow: preview.eyebrow,
            title: preview.title,
            message: preview.message,
            cta: preview.cta,
          },
          sentAt:
            createPresentationTimestamp(),
        };

      try {
        await activeRoom.localParticipant.publishData(
          encodeVyroPresentation(state),
          {
            reliable: true,
            topic:
              VYRO_PRESENTATION_TOPIC,
          },
        );

        if (cancelled) {
          return;
        }

        setScene(autoDirectorScene);

        setStatus(
          `Auto Director: ${autoDirectorScene.toUpperCase()}`,
        );
      }
      catch (directorError) {
        if (cancelled) {
          return;
        }

        console.error(
          "VYRO Auto Director error:",
          directorError,
        );

        setStatus(
          "Auto Director no pudo actualizar la escena.",
        );
      }
    }

    void directProduction();

    return () => {
      cancelled = true;
    };
  }, [
    autoDirectorEnabled,
    autoDirectorScene,
    freeCameraEnabled,
    freeCameraX,
    freeCameraY,
    freeCameraZoom,
    isLive,
    overlayVisible,
    preview,
    room,
    scene,
    stageEnabled,
    stageHostMode,
    stageLayout,
    stageMaxGuests,
  ]);
  async function selectScene(
    nextScene: VyroLiveScene,
  ) {
    setScene(nextScene);

    await publishState({
      scene: nextScene,
    });
  }

  async function showOverlay() {
    setOverlayVisible(true);

    await publishState({
      overlayVisible: true,
    });
  }

  async function hideOverlay() {
    setOverlayVisible(false);

    await publishState({
      overlayVisible: false,
    });
  }

  return (
    <section className="rounded-3xl border border-violet-400/20 bg-gradient-to-br from-[#0B1220] via-[#0B1220] to-violet-950/20 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-violet-300">
            VYRO Production Canvas
          </p>

          <h2 className="mt-2 text-xl font-black">
            Dirección del LIVE
          </h2>

          <p className="mt-2 text-sm leading-6 text-white/45">
            Controla composición y mensajes visibles para tu audiencia.
          </p>
        </div>

        <span
          className={`rounded-full border px-3 py-1.5 text-xs font-black ${
            canPublish
              ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
              : "border-white/10 bg-white/5 text-white/40"
          }`}
        >
          {canPublish
            ? "PRODUCTION LIVE"
            : "OFFLINE"}
        </span>
      </div>

      <div className="mt-6 border-t border-white/10 pt-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
              Participantes LIVE
            </p>

            <p className="mt-1 text-xs text-white/40">
              Guests conectados al Media Core.
            </p>
          </div>

          <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-black text-cyan-300">
            {guestParticipants.length}
          </span>
        </div>

        {guestParticipants.length > 0 ? (
          <div className="mt-4 space-y-3">
            {guestParticipants.map(
              (participant) => (
                <div
                  key={participant.identity}
                  className="rounded-2xl border border-white/10 bg-black/25 p-4"
                >
                  <GuestVideoPreview
                    participant={
                      participant.participant
                    }
                  />

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-white">
                        {participant.name}
                      </p>

                      <p className="mt-1 truncate text-[11px] text-white/35">
                        {participant.identity}
                      </p>
                    </div>

                    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-black text-emerald-300">
                      CONNECTED
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-[10px] font-black ${
                        participant.camera
                          ? "border-cyan-400/25 bg-cyan-400/10 text-cyan-300"
                          : "border-white/10 bg-white/5 text-white/30"
                      }`}
                    >
                      CAMERA
                    </span>

                    <span
                      className={`rounded-full border px-2.5 py-1 text-[10px] font-black ${
                        participant.microphone
                          ? "border-cyan-400/25 bg-cyan-400/10 text-cyan-300"
                          : "border-white/10 bg-white/5 text-white/30"
                      }`}
                    >
                      MICROPHONE
                    </span>

                    <span
                      className={`rounded-full border px-2.5 py-1 text-[10px] font-black ${
                        participant.screen
                          ? "border-violet-400/25 bg-violet-400/10 text-violet-300"
                          : "border-white/10 bg-white/5 text-white/30"
                      }`}
                    >
                      SCREEN
                    </span>
                  </div>
                </div>
              ),
            )}
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-dashed border-white/10 bg-black/20 px-4 py-5 text-center">
            <p className="text-sm font-bold text-white/45">
              Sin Guests conectados
            </p>

            <p className="mt-1 text-xs leading-5 text-white/30">
              Los participantes aparecerán aquí automáticamente.
            </p>
          </div>
        )}
      </div>
      <div className="mt-6">
        <div className="mb-5 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                VYRO Auto Director
              </p>

              <p className="mt-1 text-xs leading-5 text-white/40">
                VYRO adapta la escena automáticamente según los participantes y Screen Share.
              </p>
            </div>

            <button
              type="button"
              disabled={!canPublish}
              onClick={() => {
                setAutoDirectorEnabled(
                  (current) => !current,
                );
              }}
              className={`rounded-xl border px-4 py-2.5 text-xs font-black transition ${
                autoDirectorEnabled
                  ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-300"
                  : "border-white/10 bg-white/5 text-white/50 hover:bg-white/10"
              } disabled:cursor-not-allowed disabled:opacity-40`}
            >
              {autoDirectorEnabled
                ? "AUTO ON"
                : "AUTO OFF"}
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[10px] font-black text-white/45">
              0 GUEST {"\u2192"} FOCUS
            </span>

            <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[10px] font-black text-white/45">
              GUEST {"\u2192"} CINEMA
            </span>

            <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[10px] font-black text-white/45">
              SCREEN {"\u2192"} SPOTLIGHT
            </span>
          </div>
        </div>

        <p className="text-xs font-black uppercase tracking-[0.18em] text-white/40">
          Escena
        </p>

        <div className="mt-3 grid grid-cols-2 gap-3">
          {sceneOptions.map(
            (option) => {
              const active =
                option.id === scene;

              return (
                <button
                  key={option.id}
                  type="button"
                  disabled={
                    !canPublish ||
                    publishing
                  }
                  onClick={() => {
                    void selectScene(
                      option.id,
                    );
                  }}
                  className={`rounded-2xl border p-3 text-left transition ${
                    active
                      ? "border-violet-400/60 bg-violet-400/15"
                      : "border-white/10 bg-black/20 hover:border-white/20"
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  <span className="block text-sm font-black">
                    {option.name}
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-white/40">
                    {option.description}
                  </span>
                </button>
              );
            },
          )}
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-violet-400/20 bg-violet-400/[0.04]">
        <div className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-300">
                VYRO STAGE CONTROL
              </p>

              <span
                className={`rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] ${
                  stageEnabled
                    ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                    : "border-white/10 bg-black/20 text-white/35"
                }`}
              >
                {stageEnabled ? "STAGE ABIERTO" : "STAGE CERRADO"}
              </span>
            </div>

            <p className="mt-2 max-w-xl text-xs leading-5 text-white/45">
              Organiza invitados, capacidad y composición visual sin salir del Studio.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={!canPublish || publishing}
              onClick={() => {
                setStageEnabled(
                  (current) => !current,
                );
              }}
              className={`rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.14em] transition ${
                stageEnabled
                  ? "border-emerald-300/40 bg-emerald-300/15 text-emerald-200"
                  : "border-violet-300/30 bg-violet-300/10 text-violet-200"
              } disabled:cursor-not-allowed disabled:opacity-40`}
            >
              {stageEnabled
                ? "CERRAR STAGE"
                : "ABRIR STAGE"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStagePanelOpen(
                  (current) => !current,
                );
              }}
              className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-white/60 transition hover:border-white/20 hover:text-white"
            >
              {stagePanelOpen
                ? "OCULTAR CONTROLES"
                : "DESPLEGAR"}
            </button>
          </div>
        </div>

        {stagePanelOpen ? (
          <div className="relative z-20 border-t border-violet-300/20 bg-[#070B14]/95 p-5 shadow-[0_-24px_80px_rgba(124,58,237,0.12)] backdrop-blur-xl">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-violet-300/20 bg-gradient-to-r from-violet-400/[0.10] via-cyan-400/[0.05] to-transparent p-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-violet-200">
                  VYRO LIVE STAGE
                </p>

                <p className="mt-1 text-sm font-black text-white">
                  Escenario de producción
                </p>

                <p className="mt-1 text-xs leading-5 text-white/40">
                  Organiza al creador y los invitados antes de mostrarlos a la audiencia.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.12em] text-cyan-200">
                  {guestParticipants.length} conectados
                </span>

                <span className="rounded-full border border-violet-300/20 bg-violet-300/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.12em] text-violet-200">
                  {stageMaxGuests} espacios
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setStagePanelOpen(false);
                  }}
                  className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[9px] font-black uppercase tracking-[0.14em] text-white/60 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                >
                  CERRAR PANEL
                </button>
              </div>
            </div>

            <div className="mb-5 grid gap-4 xl:grid-cols-2">
              <div className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.04] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-300">
                      WAITING ROOM
                    </p>

                    <p className="mt-1 text-xs text-white/40">
                      Invitados aceptados esperando autorización para subir.
                    </p>
                  </div>

                  <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-[10px] font-black text-amber-200">
                    {waitingGuestInvitations.length}
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  {waitingGuestInvitations.length > 0 ? (
                    waitingGuestInvitations.map(
                      (invitation) => {
                        const guestName =
                          invitation.guest?.full_name ??
                          invitation.guest?.username ??
                          "VYRO Guest";

                        const busy =
                          guestStageBusyId ===
                          invitation.id;

                        return (
                          <div
                            key={invitation.id}
                            className="rounded-2xl border border-white/10 bg-black/25 p-4"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate text-sm font-black text-white">
                                  {guestName}
                                </p>

                                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-amber-300/70">
                                  LISTO EN WAITING
                                </p>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  disabled={
                                    busy ||
                                    !stageEnabled ||
                                    !stageHasCapacity
                                  }
                                  onClick={() => {
                                    void moveGuestToStage(
                                      invitation.id,
                                    );
                                  }}
                                  className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-2 text-[9px] font-black uppercase tracking-[0.12em] text-emerald-200 transition hover:bg-emerald-300/15 disabled:cursor-not-allowed disabled:opacity-35"
                                >
                                  {busy
                                    ? "PROCESANDO..."
                                    : "SUBIR AL STAGE"}
                                </button>

                                <button
                                  type="button"
                                  disabled={busy}
                                  onClick={() => {
                                    void removeStageGuest(
                                      invitation.id,
                                    );
                                  }}
                                  className="rounded-full border border-red-300/20 bg-red-300/[0.06] px-3 py-2 text-[9px] font-black uppercase tracking-[0.12em] text-red-200/80 transition hover:bg-red-300/10 disabled:cursor-not-allowed disabled:opacity-35"
                                >
                                  RETIRAR
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      },
                    )
                  ) : (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-5 text-center">
                      <p className="text-xs font-bold text-white/30">
                        No hay invitados esperando.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.04] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-300">
                      ON STAGE
                    </p>

                    <p className="mt-1 text-xs text-white/40">
                      Invitados autorizados actualmente para el escenario.
                    </p>
                  </div>

                  <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[10px] font-black text-emerald-200">
                    {onStageGuestInvitations.length}/{stageMaxGuests}
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  {onStageGuestInvitations.length > 0 ? (
                    onStageGuestInvitations.map(
                      (invitation) => {
                        const guestName =
                          invitation.guest?.full_name ??
                          invitation.guest?.username ??
                          "VYRO Guest";

                        const busy =
                          guestStageBusyId ===
                          invitation.id;

                        return (
                          <div
                            key={invitation.id}
                            className="rounded-2xl border border-emerald-300/15 bg-black/25 p-4"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate text-sm font-black text-white">
                                  {guestName}
                                </p>

                                <p className="mt-1 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-300">
                                  LIVE ON STAGE
                                </p>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  disabled={busy}
                                  onClick={() => {
                                    void moveGuestToWaiting(
                                      invitation.id,
                                    );
                                  }}
                                  className="rounded-full border border-amber-300/25 bg-amber-300/[0.08] px-3 py-2 text-[9px] font-black uppercase tracking-[0.12em] text-amber-200 transition hover:bg-amber-300/15 disabled:cursor-not-allowed disabled:opacity-35"
                                >
                                  {busy
                                    ? "PROCESANDO..."
                                    : "BAJAR A WAITING"}
                                </button>

                                <button
                                  type="button"
                                  disabled={busy}
                                  onClick={() => {
                                    void removeStageGuest(
                                      invitation.id,
                                    );
                                  }}
                                  className="rounded-full border border-red-300/20 bg-red-300/[0.06] px-3 py-2 text-[9px] font-black uppercase tracking-[0.12em] text-red-200/80 transition hover:bg-red-300/10 disabled:cursor-not-allowed disabled:opacity-35"
                                >
                                  RETIRAR
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      },
                    )
                  ) : (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-5 text-center">
                      <p className="text-xs font-bold text-white/30">
                        Ningún Guest está en el Stage.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {guestStageStatus ? (
              <div className="mb-5 rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.05] px-4 py-3">
                <p className="text-xs font-bold text-cyan-100/75">
                  {guestStageStatus}
                </p>
              </div>
            ) : null}

            <div className="grid gap-4 xl:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/40">
                  Capacidad de invitados
                </p>

                <p className="mt-1 text-xs leading-5 text-white/35">
                  Decide cuántas personas pueden ocupar el Stage.
                </p>

                <div className="mt-4 grid grid-cols-6 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
                    (amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => {
                          setStageMaxGuests(
                            amount,
                          );
                          onStageMaxGuestsChange?.(amount);
                        }}
                        className={`rounded-xl border py-2 text-xs font-black transition ${
                          stageMaxGuests === amount
                            ? "border-violet-300/50 bg-violet-300/15 text-violet-200"
                            : "border-white/10 bg-white/[0.03] text-white/40 hover:border-white/20"
                        }`}
                      >
                        {amount}
                      </button>
                    ),
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/40">
                  Composición
                </p>

                <p className="mt-1 text-xs leading-5 text-white/35">
                  Controla cómo se organiza el escenario.
                </p>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {(
                    [
                      ["auto", "AUTO"],
                      ["grid", "GRID"],
                      ["spotlight", "SPOTLIGHT"],
                    ] as const
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setStageLayout(value);
                      }}
                      className={`rounded-xl border px-2 py-2 text-[10px] font-black transition ${
                        stageLayout === value
                          ? "border-cyan-300/40 bg-cyan-300/10 text-cyan-200"
                          : "border-white/10 bg-white/[0.03] text-white/40 hover:border-white/20"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/40">
                  Mi cámara
                </p>

                <p className="mt-1 text-xs leading-5 text-white/35">
                  El creador decide si domina la pantalla o se convierte en ventana.
                </p>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {(
                    [
                      ["fullscreen", "FULL"],
                      ["window", "WINDOW"],
                      ["pip", "PIP"],
                    ] as const
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setStageHostMode(value);
                      }}
                      className={`rounded-xl border px-2 py-2 text-[10px] font-black transition ${
                        stageHostMode === value
                          ? "border-fuchsia-300/40 bg-fuchsia-300/10 text-fuchsia-200"
                          : "border-white/10 bg-white/[0.03] text-white/40 hover:border-white/20"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>
        ) : null}
      </div>
      <div className="mt-6 rounded-3xl border border-cyan-400/20 bg-cyan-400/[0.04] p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
              VYRO FREE CAMERA
            </p>

            <p className="mt-1 text-xs leading-5 text-white/45">
              Controla el encuadre que verá tu audiencia.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setFreeCameraEnabled(
                (current) => !current,
              );
            }}
            className={`rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.14em] transition ${
              freeCameraEnabled
                ? "border-cyan-300/40 bg-cyan-300/15 text-cyan-200"
                : "border-white/10 bg-white/[0.03] text-white/40"
            }`}
          >
            {freeCameraEnabled ? "ACTIVA" : "OFF"}
          </button>
        </div>

        <div className="mt-5 space-y-5">
          <label className="block">
            <div className="mb-2 flex items-center justify-between text-xs font-bold text-white/55">
              <span>Horizontal</span>
              <span>{freeCameraX}</span>
            </div>

            <input
              type="range"
              min="-100"
              max="100"
              step="1"
              value={freeCameraX}
              onChange={(event) => {
                setFreeCameraX(Number(event.target.value));
              }}
              className="w-full accent-cyan-300"
            />
          </label>

          <label className="block">
            <div className="mb-2 flex items-center justify-between text-xs font-bold text-white/55">
              <span>Vertical</span>
              <span>{freeCameraY}</span>
            </div>

            <input
              type="range"
              min="-100"
              max="100"
              step="1"
              value={freeCameraY}
              onChange={(event) => {
                setFreeCameraY(Number(event.target.value));
              }}
              className="w-full accent-cyan-300"
            />
          </label>

          <label className="block">
            <div className="mb-2 flex items-center justify-between text-xs font-bold text-white/55">
              <span>Zoom</span>

              <span>
                {freeCameraZoom.toFixed(1)}x
              </span>
            </div>

            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={freeCameraZoom}
              onChange={(event) => {
                setFreeCameraZoom(Number(event.target.value));
              }}
              className="w-full accent-cyan-300"
            />
          </label>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setFreeCameraX(0);
              setFreeCameraY(0);
              setFreeCameraZoom(1);
            }}
            className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs font-black text-white/65 transition hover:bg-white/[0.07]"
          >
            CENTRAR
          </button>

          <button
            type="button"
            disabled={!canPublish || publishing}
            onClick={() => {
              void publishState();
            }}
            className="rounded-xl bg-cyan-400 px-4 py-3 text-xs font-black text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {publishing
              ? "ENVIANDO..."
              : "APLICAR AL LIVE"}
          </button>
        </div>
      </div>
      <div className="mt-6 overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/[0.07] via-black/20 to-violet-400/[0.07]">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 p-4">
          <div className="flex items-center gap-3">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                overlayVisible
                  ? "bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.9)]"
                  : "bg-white/20"
              }`}
            />

            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                LIVE Overlay
              </p>

              <p className="mt-1 text-[11px] text-white/35">
                Mensaje visible para tu audiencia
              </p>
            </div>
          </div>

          <span
            className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${
              overlayVisible
                ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                : "border-white/10 bg-white/5 text-white/35"
            }`}
          >
            {overlayVisible
              ? "ON AIR"
              : "OCULTO"}
          </span>
        </div>

        <div className="space-y-3 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              value={eyebrow}
              onChange={(event) => {
                setEyebrow(
                  event.target.value,
                );
              }}
              placeholder="Etiqueta \u00B7 AHORA EN VIVO"
              maxLength={32}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-cyan-400/50"
            />

            <input
              value={cta}
              onChange={(event) => {
                setCta(
                  event.target.value,
                );
              }}
              placeholder="CTA \u00B7 SEGUIR"
              maxLength={60}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-cyan-400/50"
            />
          </div>

          <input
            value={title}
            onChange={(event) => {
              setTitle(
                event.target.value,
              );
            }}
            placeholder="Titulo principal"
            maxLength={80}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm font-bold text-white outline-none transition placeholder:text-white/20 focus:border-cyan-400/50"
          />

          <textarea
            value={message}
            onChange={(event) => {
              setMessage(
                event.target.value,
              );
            }}
            placeholder="Mensaje para la audiencia"
            maxLength={180}
            rows={2}
            className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm leading-5 text-white outline-none transition placeholder:text-white/20 focus:border-cyan-400/50"
          />

          <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-300">
                Preview audiencia
              </p>

              <span className="rounded-full border border-red-400/20 bg-red-400/10 px-2 py-1 text-[9px] font-black text-red-300">
                LIVE
              </span>
            </div>

            {preview.eyebrow ? (
              <p className="mt-3 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-300">
                {preview.eyebrow}
              </p>
            ) : null}

            <p className="mt-1 text-base font-black text-white">
              {preview.title ||
                "Tu anuncio aparecerá aquí"}
            </p>

            {preview.message ? (
              <p className="mt-1 text-xs leading-5 text-white/50">
                {preview.message}
              </p>
            ) : null}

            {preview.cta ? (
              <span className="mt-3 inline-flex rounded-full bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-black">
                {preview.cta}
              </span>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={
                !canPublish ||
                publishing
              }
              onClick={() => {
                void showOverlay();
              }}
              className="rounded-xl bg-cyan-400 px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {publishing
                ? "PUBLICANDO..."
                : overlayVisible
                  ? "ACTUALIZAR"
                  : "PUBLICAR"}
            </button>

            <button
              type="button"
              disabled={
                !canPublish ||
                publishing ||
                !overlayVisible
              }
              onClick={() => {
                void hideOverlay();
              }}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
            >
              OCULTAR
            </button>
          </div>

          <p className="text-center text-[9px] font-bold uppercase tracking-[0.12em] text-white/25">
            Solo se muestra en el LIVE cuando tu lo publicas
          </p>

          {status ? (
            <p
              aria-live="polite"
              className="text-center text-xs font-semibold text-white/50"
            >
              {status}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

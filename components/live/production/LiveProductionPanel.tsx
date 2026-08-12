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

import {
  DEFAULT_VYRO_PRESENTATION_STATE,
  encodeVyroPresentation,
  VYRO_PRESENTATION_TOPIC,
  type VyroLivePresentationState,
  type VyroLiveScene,
} from "@/lib/live/presentation/protocol";

type LiveProductionPanelProps = {
  room: Room | null;
  isLive: boolean;
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
}: LiveProductionPanelProps) {
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

  const [publishing, setPublishing] =
    useState(false);

  const [status, setStatus] =
    useState("");

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

      <div className="mt-7 border-t border-white/10 pt-6">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-white/40">
          Live Overlay
        </p>

        <div className="mt-4 space-y-3">
          <input
            value={eyebrow}
            onChange={(event) => {
              setEyebrow(
                event.target.value,
              );
            }}
            placeholder="Etiqueta: AHORA / EXCLUSIVO / NUEVO"
            maxLength={32}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-400"
          />

          <input
            value={title}
            onChange={(event) => {
              setTitle(
                event.target.value,
              );
            }}
            placeholder="Título del anuncio"
            maxLength={80}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm font-bold text-white outline-none transition focus:border-violet-400"
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
            rows={3}
            className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-400"
          />

          <input
            value={cta}
            onChange={(event) => {
              setCta(
                event.target.value,
              );
            }}
            placeholder="CTA opcional: Sígueme / Próxima ronda / Nuevo lanzamiento"
            maxLength={60}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-400"
          />
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-violet-300">
            Preview
          </p>

          {preview.eyebrow ? (
            <p className="mt-3 text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
              {preview.eyebrow}
            </p>
          ) : null}

          <p className="mt-2 text-lg font-black">
            {preview.title ||
              "Tu anuncio aparecerá aquí"}
          </p>

          {preview.message ? (
            <p className="mt-2 text-sm leading-6 text-white/55">
              {preview.message}
            </p>
          ) : null}

          {preview.cta ? (
            <span className="mt-3 inline-flex rounded-full bg-white px-3 py-1.5 text-xs font-black text-black">
              {preview.cta}
            </span>
          ) : null}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={
              !canPublish ||
              publishing
            }
            onClick={() => {
              void showOverlay();
            }}
            className="rounded-xl bg-violet-500 px-4 py-3 text-sm font-black text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Publicar overlay
          </button>

          <button
            type="button"
            disabled={
              !canPublish ||
              publishing
            }
            onClick={() => {
              void hideOverlay();
            }}
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-black text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Ocultar overlay
          </button>
        </div>

        {status ? (
          <p
            aria-live="polite"
            className="mt-4 text-xs font-semibold text-white/50"
          >
            {status}
          </p>
        ) : null}
      </div>
    </section>
  );
}
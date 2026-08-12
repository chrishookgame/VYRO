"use client";

import {
  Participant,
  RemoteTrack,
  RemoteTrackPublication,
  Room,
  RoomEvent,
  Track,
} from "livekit-client";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  decodeVyroPresentation,
  DEFAULT_VYRO_PRESENTATION_STATE,
  VYRO_PRESENTATION_TOPIC,
  type VyroLivePresentationState,
} from "@/lib/live/presentation/protocol";

type LiveViewerMediaProps = {
  roomId: string;
};

type TokenResponse = {
  success: boolean;
  token: string;
  url: string;
  error?: string;
};

export function LiveViewerMedia({
  roomId,
}: LiveViewerMediaProps) {
  const videoContainerRef =
    useRef<HTMLDivElement>(null);

  const audioContainerRef =
    useRef<HTMLDivElement>(null);

  const roomRef =
    useRef<Room | null>(null);

  const hostCameraTrackRef =
    useRef<RemoteTrack | null>(null);

  const guestCameraTracksRef =
    useRef<Map<string, RemoteTrack>>(
      new Map(),
    );

  const screenTrackRef =
    useRef<RemoteTrack | null>(null);

  const activeVideoTracksRef =
    useRef<RemoteTrack[]>([]);

  const [connecting, setConnecting] =
    useState(true);

  const [connected, setConnected] =
    useState(false);

  const [hasVideo, setHasVideo] =
    useState(false);

  const [screenSharing, setScreenSharing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [
    presentationState,
    setPresentationState,
  ] =
    useState<VyroLivePresentationState>(
      DEFAULT_VYRO_PRESENTATION_STATE,
    );

  const renderPreferredVideo =
    useCallback(() => {
      const container =
        videoContainerRef.current;

      if (!container) {
        return;
      }

      const screenTrack =
        screenTrackRef.current;

      const hostTrack =
        hostCameraTrackRef.current;

      const guestTracks =
        Array.from(
          guestCameraTracksRef.current.values(),
        );

      const nextTracks =
        screenTrack
          ? [screenTrack]
          : [
              ...(hostTrack
                ? [hostTrack]
                : []),
              ...guestTracks,
            ];

      const previousTracks =
        activeVideoTracksRef.current;

      const sameTracks =
        previousTracks.length ===
          nextTracks.length &&
        previousTracks.every(
          (track, index) =>
            track === nextTracks[index],
        );

      if (sameTracks) {
        setHasVideo(nextTracks.length > 0);
        setScreenSharing(Boolean(screenTrack));
        return;
      }

      previousTracks.forEach((track) => {
        track.detach().forEach(
          (element) => element.remove(),
        );
      });

      container.replaceChildren();

      activeVideoTracksRef.current =
        nextTracks;

      if (nextTracks.length === 0) {
        setHasVideo(false);
        setScreenSharing(false);
        return;
      }

      if (screenTrack) {
        const element =
          screenTrack.attach();

        element.autoplay = true;
        element.setAttribute(
          "playsinline",
          "",
        );

        element.className =
          "h-full w-full object-contain";

        container.appendChild(element);

        setHasVideo(true);
        setScreenSharing(true);
        return;
      }

      const grid =
        document.createElement("div");

      grid.className =
        nextTracks.length === 1
          ? "grid h-full w-full grid-cols-1"
          : "grid h-full w-full grid-cols-1 gap-1 md:grid-cols-2";

      nextTracks.forEach(
        (track, index) => {
          const frame =
            document.createElement("div");

          frame.className =
            "relative min-h-0 overflow-hidden bg-black";

          const element =
            track.attach();

          element.autoplay = true;
          element.setAttribute(
            "playsinline",
            "",
          );

          element.className =
            "h-full w-full object-cover";

          const badge =
            document.createElement("div");

          badge.className =
            "pointer-events-none absolute left-3 top-3 rounded-full border border-white/15 bg-black/65 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white backdrop-blur-xl";

          badge.textContent =
            index === 0 && hostTrack
              ? "HOST"
              : "GUEST";

          frame.appendChild(element);
          frame.appendChild(badge);
          grid.appendChild(frame);
        },
      );

      container.appendChild(grid);

      setHasVideo(true);
      setScreenSharing(false);
    }, []);

  const attachTrack =
    useCallback(
      (
        track: RemoteTrack,
        publication:
          RemoteTrackPublication,
        participant?: Participant,
      ) => {
        if (
          track.kind === Track.Kind.Video
        ) {
          if (
            publication.source ===
            Track.Source.ScreenShare
          ) {
            screenTrackRef.current =
              track;
          } else if (
            publication.source ===
            Track.Source.Camera
          ) {
            const identity =
              participant?.identity ?? "";

            if (
              identity.startsWith(
                "guest:",
              )
            ) {
              guestCameraTracksRef.current.set(
                identity,
                track,
              );
            } else {
              hostCameraTrackRef.current =
                track;
            }
          }

          renderPreferredVideo();
          return;
        }

        if (
          track.kind === Track.Kind.Audio
        ) {
          const container =
            audioContainerRef.current;

          if (!container) {
            return;
          }

          const element = track.attach();

          element.autoplay = true;

          container.appendChild(element);
        }
      },
      [renderPreferredVideo],
    );

  const detachTrack =
    useCallback(
      (
        track: RemoteTrack,
        publication:
          RemoteTrackPublication,
        participant?: Participant,
      ) => {
        track.detach().forEach(
          (element) => element.remove(),
        );

        if (
          publication.source ===
            Track.Source.ScreenShare &&
          screenTrackRef.current === track
        ) {
          screenTrackRef.current = null;
        }

        if (
          publication.source ===
            Track.Source.Camera
        ) {
          const identity =
            participant?.identity ?? "";

          if (
            identity.startsWith(
              "guest:",
            )
          ) {
            guestCameraTracksRef.current.delete(
              identity,
            );
          } else if (
            hostCameraTrackRef.current ===
              track
          ) {
            hostCameraTrackRef.current =
              null;
          }
        }

        activeVideoTracksRef.current =
          activeVideoTracksRef.current.filter(
            (activeTrack) =>
              activeTrack !== track,
          );

        renderPreferredVideo();
      },
      [renderPreferredVideo],
    );

  useEffect(() => {
    let disposed = false;

    const videoContainer =
      videoContainerRef.current;

    const audioContainer =
      audioContainerRef.current;

    const room = new Room({
      adaptiveStream: true,
      dynacast: true,
    });

    roomRef.current = room;

    const handleTrackSubscribed = (
      track: RemoteTrack,
      publication:
        RemoteTrackPublication,
      participant: Participant,
    ) => {
      attachTrack(
        track,
        publication,
        participant,
      );
    };

    const handleTrackUnsubscribed = (
      track: RemoteTrack,
      publication:
        RemoteTrackPublication,
      participant: Participant,
    ) => {
      detachTrack(
        track,
        publication,
        participant,
      );
    };

    const handleParticipantConnected = (
      participant: Participant,
    ) => {
      participant.trackPublications.forEach(
        (publication) => {
          if (
            publication.track &&
            publication.track instanceof
              RemoteTrack
          ) {
            attachTrack(
              publication.track,
              publication as
                RemoteTrackPublication,
              participant,
            );
          }
        },
      );
    };

    const handleDataReceived = (
      payload: Uint8Array,
      participant?: Participant,
      _kind?: unknown,
      topic?: string,
    ) => {
      if (
        topic !==
          VYRO_PRESENTATION_TOPIC ||
        !participant?.identity.startsWith(
          "host:",
        )
      ) {
        return;
      }

      const nextState =
        decodeVyroPresentation(
          payload,
        );

      if (!nextState) {
        return;
      }

      setPresentationState(
        nextState,
      );
    };
    const connect = async () => {
      setConnecting(true);
      setError("");

      try {
        const response = await fetch(
          "/api/live/token",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              roomId,
              role: "viewer",
            }),
          },
        );

        const payload =
          (await response.json()) as
            TokenResponse;

        if (
          !response.ok ||
          !payload.success ||
          !payload.token ||
          !payload.url
        ) {
          throw new Error(
            payload.error ||
              "No fue posible conectar con VYRO LIVE.",
          );
        }

        if (disposed) {
          return;
        }

        room.on(
          RoomEvent.TrackSubscribed,
          handleTrackSubscribed,
        );

        room.on(
          RoomEvent.TrackUnsubscribed,
          handleTrackUnsubscribed,
        );

        room.on(
          RoomEvent.ParticipantConnected,
          handleParticipantConnected,
        );

        room.on(
          RoomEvent.DataReceived,
          handleDataReceived,
        );

        room.on(
          RoomEvent.Disconnected,
          () => {
            if (!disposed) {
              setConnected(false);
            }
          },
        );

        await room.connect(
          payload.url,
          payload.token,
        );

        if (disposed) {
          await room.disconnect();
          return;
        }

        setConnected(true);

        room.remoteParticipants.forEach(
          (participant) => {
            participant.trackPublications.forEach(
              (publication) => {
                const track =
                  publication.track;

                if (
                  track &&
                  track instanceof
                    RemoteTrack
                ) {
                  attachTrack(
                    track,
                    publication,
                    participant,
                  );
                }
              },
            );
          },
        );
      } catch (connectError) {
        console.error(
          "VYRO Viewer Media Core error:",
          connectError,
        );

        if (!disposed) {
          setError(
            connectError instanceof Error
              ? connectError.message
              : "No fue posible recibir esta transmisión.",
          );
        }
      } finally {
        if (!disposed) {
          setConnecting(false);
        }
      }
    };

    void connect();

    const guestCameraTracks =
      guestCameraTracksRef.current;

    return () => {
      disposed = true;

      room.off(
        RoomEvent.TrackSubscribed,
        handleTrackSubscribed,
      );

      room.off(
        RoomEvent.TrackUnsubscribed,
        handleTrackUnsubscribed,
      );

      room.off(
        RoomEvent.ParticipantConnected,
        handleParticipantConnected,
      );

      room.off(
        RoomEvent.DataReceived,
        handleDataReceived,
      );

      hostCameraTrackRef.current
        ?.detach()
        .forEach(
          (element) => element.remove(),
        );

      guestCameraTracks
        .forEach((track) => {
          track.detach().forEach(
            (element) => element.remove(),
          );
        });

      screenTrackRef.current
        ?.detach()
        .forEach(
          (element) => element.remove(),
        );

      hostCameraTrackRef.current = null;
      guestCameraTracks.clear();
      screenTrackRef.current = null;
      activeVideoTracksRef.current = [];

      audioContainer?.replaceChildren();

      videoContainer?.replaceChildren();

      roomRef.current = null;

      void room.disconnect();
    };
  }, [
    attachTrack,
    detachTrack,
    roomId,
  ]);

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-2xl">
      <div className="relative aspect-video min-h-[320px] bg-black">
        <div
          ref={videoContainerRef}
          data-vyro-scene={
            presentationState.scene
          }
          className={`absolute inset-0 flex items-center justify-center overflow-hidden ${
            presentationState.scene ===
            "portrait"
              ? "mx-auto max-w-[560px]"
              : ""
          }`}
        />

        <div
          ref={audioContainerRef}
          className="hidden"
        />

        {!hasVideo ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#05070A] via-[#07111D] to-black px-6 text-center">
            <div>
              <div className="mx-auto h-16 w-16 animate-pulse rounded-full border border-cyan-400/30 bg-cyan-400/10" />

              <p className="mt-5 text-lg font-black text-white">
                {connecting
                  ? "Conectando con VYRO LIVE..."
                  : connected
                    ? "Esperando video del creador"
                    : "Transmisión no conectada"}
              </p>

              {error ? (
                <p className="mx-auto mt-3 max-w-lg text-sm text-red-300">
                  {error}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

        {presentationState.overlay.visible ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-5 md:p-8">
            <div className="max-w-3xl rounded-[1.75rem] border border-white/15 bg-black/70 p-5 shadow-2xl backdrop-blur-2xl md:p-6">
              {presentationState.overlay.eyebrow ? (
                <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
                  {
                    presentationState
                      .overlay
                      .eyebrow
                  }
                </p>
              ) : null}

              {presentationState.overlay.title ? (
                <h2 className="mt-2 text-2xl font-black tracking-tight text-white md:text-3xl">
                  {
                    presentationState
                      .overlay
                      .title
                  }
                </h2>
              ) : null}

              {presentationState.overlay.message ? (
                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70 md:text-base">
                  {
                    presentationState
                      .overlay
                      .message
                  }
                </p>
              ) : null}

              {presentationState.overlay.cta ? (
                <span className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-wide text-black">
                  {
                    presentationState
                      .overlay
                      .cta
                  }
                </span>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="pointer-events-none absolute right-4 top-4 z-20 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white/55 backdrop-blur-xl">
          {presentationState.scene}
        </div>
        <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2">
          <span
            className={`rounded-full border px-3 py-1.5 text-xs font-black uppercase tracking-wider backdrop-blur-xl ${
              connected
                ? "border-red-400/30 bg-red-500/80 text-white"
                : "border-white/20 bg-black/60 text-white/60"
            }`}
          >
            {connected
              ? "LIVE"
              : "CONNECTING"}
          </span>

          {screenSharing ? (
            <span className="rounded-full border border-cyan-400/30 bg-black/70 px-3 py-1.5 text-xs font-bold text-cyan-300 backdrop-blur-xl">
              Pantalla compartida
            </span>
          ) : null}
        </div>
      </div>
    </section>
  );
}
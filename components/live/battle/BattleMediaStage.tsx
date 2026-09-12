"use client";

import {
  useEffect,
  useState,
} from "react";
import {
  RemoteParticipant,
  RemoteTrack,
  Room,
  RoomEvent,
  Track,
} from "livekit-client";

type BattleMediaStageProps = {
  room: Room | null;
  active?: boolean;
  mode?: "creator" | "viewer";
  cameraEnabled?: boolean;
  microphoneEnabled?: boolean;
  onToggleCamera?: () => void | Promise<void>;
  onToggleMicrophone?: () => void | Promise<void>;
};

function BattleVideo({
  track,
  label,
}: {
  track: Track | null;
  label: string;
}) {
  const [
    videoElement,
    setVideoElement,
  ] = useState<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!videoElement || !track) {
      return;
    }

    track.attach(videoElement);

    console.info(
      "[VYRO BATTLE VIDEO] ATTACHED",
      {
        label,
        kind: track.kind,
        elementPaused:
          videoElement.paused,
        autoplay:
          videoElement.autoplay,
        muted:
          videoElement.muted,
      },
    );

    return () => {
      track.detach(videoElement);
    };
  }, [
    track,
    videoElement,
  ]);

  return (
    <div className="relative min-h-0 flex-1 overflow-hidden bg-black">
      {track ? (
        <video
          ref={setVideoElement}
          autoPlay
          playsInline
          muted
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full min-h-48 items-center justify-center text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
          Esperando cámara
        </div>
      )}

      <div className="absolute bottom-3 left-3 rounded-full border border-emerald-400/30 bg-black/65 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-300 backdrop-blur">
        {label}
      </div>
    </div>
  );
}

export function BattleMediaStage({
  room,
  active = true,
  mode = "creator",
  cameraEnabled,
  microphoneEnabled,
  onToggleCamera,
  onToggleMicrophone,
}: BattleMediaStageProps) {
  const [
    controlsOpen,
    setControlsOpen,
  ] = useState(false);
  const [
    battleParticipant,
    setBattleParticipant,
  ] = useState<RemoteParticipant | null>(
    null,
  );

  const [
    battleVideoTrack,
    setBattleVideoTrack,
  ] = useState<RemoteTrack | null>(
    null,
  );

  const [
    creatorVideoTrack,
    setCreatorVideoTrack,
  ] = useState<Track | null>(
    null,
  );

  useEffect(() => {
    if (!room || !active) {
      setBattleParticipant(null);
      setBattleVideoTrack(null);
      setCreatorVideoTrack(null);
      return;
    }

    const syncCreatorCamera = () => {
      if (mode === "viewer") {
        const participant =
          Array.from(
            room.remoteParticipants.values(),
          ).find(
            (candidate) =>
              candidate.identity.startsWith(
                "host:",
              ),
          ) ?? null;

        const publication =
          participant?.getTrackPublication(
            Track.Source.Camera,
          ) ?? null;

        const track =
          publication?.track ?? null;

        setCreatorVideoTrack(
          track instanceof RemoteTrack &&
            !publication?.isMuted
            ? track
            : null,
        );

        return;
      }

      const publication =
        room.localParticipant
          .getTrackPublication(
            Track.Source.Camera,
          );

      const track =
        publication?.track ?? null;

      setCreatorVideoTrack(
        track &&
          !publication?.isMuted
          ? track
          : null,
      );
    };

    const syncBattleParticipant = () => {
      const participant =
        Array.from(
          room.remoteParticipants.values(),
        ).find(
          (candidate) =>
            candidate.identity.startsWith(
              "battle:",
            ),
        ) ?? null;

      setBattleParticipant(participant);

      const publication =
        participant?.getTrackPublication(
          Track.Source.Camera,
        ) ?? null;

      const track =
        publication?.track;

      console.info(
        "[VYRO BATTLE VIDEO] SYNC",
        {
          mode,
          localIdentity:
            room.localParticipant.identity,
          remoteIdentities:
            Array.from(
              room.remoteParticipants.values(),
            ).map(
              (candidate) =>
                candidate.identity,
            ),
          battleIdentity:
            participant?.identity ?? null,
          hasCameraPublication:
            Boolean(publication),
          hasCameraTrack:
            Boolean(track),
          cameraMuted:
            publication?.isMuted ?? null,
          trackKind:
            track?.kind ?? null,
        },
      );

      setBattleVideoTrack(
        track instanceof RemoteTrack &&
          !publication?.isMuted
          ? track
          : null,
      );
    };

    const handleParticipantConnected = (
      participant: RemoteParticipant,
    ) => {
      if (
        participant.identity.startsWith(
          "battle:",
        )
      ) {
        syncBattleParticipant();
      }

      if (
        mode === "viewer" &&
        participant.identity.startsWith(
          "host:",
        )
      ) {
        syncCreatorCamera();
      }
    };

    const handleParticipantDisconnected = (
      participant: RemoteParticipant,
    ) => {
      if (
        participant.identity.startsWith(
          "battle:",
        )
      ) {
        syncBattleParticipant();
      }

      if (
        mode === "viewer" &&
        participant.identity.startsWith(
          "host:",
        )
      ) {
        syncCreatorCamera();
      }
    };

    const handleTrackSubscribed = (
      track: RemoteTrack,
      _publication: unknown,
      participant: RemoteParticipant,
    ) => {
      if (
        participant.identity.startsWith(
          "battle:",
        ) &&
        track.kind === Track.Kind.Video
      ) {
        syncBattleParticipant();
      }

      if (
        mode === "viewer" &&
        participant.identity.startsWith(
          "host:",
        ) &&
        track.kind === Track.Kind.Video
      ) {
        syncCreatorCamera();
      }
    };

    const handleTrackUnsubscribed = (
      track: RemoteTrack,
      _publication: unknown,
      participant: RemoteParticipant,
    ) => {
      if (
        participant.identity.startsWith(
          "battle:",
        ) &&
        track.kind === Track.Kind.Video
      ) {
        syncBattleParticipant();
      }

      if (
        mode === "viewer" &&
        participant.identity.startsWith(
          "host:",
        ) &&
        track.kind === Track.Kind.Video
      ) {
        syncCreatorCamera();
      }
    };

    const handleTrackMuted = () => {
      syncCreatorCamera();
      syncBattleParticipant();
    };

    const handleTrackUnmuted = () => {
      syncCreatorCamera();
      syncBattleParticipant();
    };

    syncCreatorCamera();
    syncBattleParticipant();

    room.on(
      RoomEvent.ParticipantConnected,
      handleParticipantConnected,
    );
    room.on(
      RoomEvent.ParticipantDisconnected,
      handleParticipantDisconnected,
    );
    room.on(
      RoomEvent.TrackSubscribed,
      handleTrackSubscribed,
    );
    room.on(
      RoomEvent.TrackUnsubscribed,
      handleTrackUnsubscribed,
    );
    room.on(
      RoomEvent.TrackMuted,
      handleTrackMuted,
    );
    room.on(
      RoomEvent.TrackUnmuted,
      handleTrackUnmuted,
    );

    return () => {
      room.off(
        RoomEvent.ParticipantConnected,
        handleParticipantConnected,
      );
      room.off(
        RoomEvent.ParticipantDisconnected,
        handleParticipantDisconnected,
      );
      room.off(
        RoomEvent.TrackSubscribed,
        handleTrackSubscribed,
      );
      room.off(
        RoomEvent.TrackUnsubscribed,
        handleTrackUnsubscribed,
      );
      room.off(
        RoomEvent.TrackMuted,
        handleTrackMuted,
      );
      room.off(
        RoomEvent.TrackUnmuted,
        handleTrackUnmuted,
      );
    };
  }, [
    room,
    active,
    mode,
  ]);

  if (!active) {
    return null;
  }

  return (
    <section
      data-vyro-battle-media-stage
      className="relative overflow-hidden rounded-2xl border border-emerald-400/30 bg-black shadow-2xl"
    >
      <div className="flex items-center justify-between border-b border-emerald-400/20 bg-black/95 px-4 py-2">
        <div className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
          ⚔ VYRO BATTLE
        </div>

        <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45">
          {battleParticipant
            ? "Rival conectado"
            : "Esperando rival"}
        </div>
      </div>

      <div className="grid aspect-video grid-cols-2 divide-x divide-emerald-400/20 bg-black">
        <BattleVideo
          track={creatorVideoTrack}
          label="Creator"
        />

        <BattleVideo
          track={battleVideoTrack}
          label="Rival"
        />
      </div>

      {onToggleCamera || onToggleMicrophone ? (
        <div className="absolute bottom-4 right-4 z-20">
          {controlsOpen ? (
            <div className="absolute bottom-14 right-0 w-64 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/95 p-2 shadow-2xl backdrop-blur-xl">
              <div className="px-3 pb-2 pt-1">
                <div className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">
                  VYRO LIVE
                </div>

                <div className="mt-0.5 text-sm font-black text-white">
                  Controles
                </div>
              </div>

              {onToggleCamera ? (
                <button
                  type="button"
                  onClick={() => {
                    void onToggleCamera();
                  }}
                  className="flex min-h-11 w-full items-center justify-between rounded-xl px-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  <span>Cámara</span>

                  <span
                    className={
                      cameraEnabled
                        ? "text-emerald-300"
                        : "text-white/40"
                    }
                  >
                    {cameraEnabled ? "ON" : "OFF"}
                  </span>
                </button>
              ) : null}

              {onToggleMicrophone ? (
                <button
                  type="button"
                  onClick={() => {
                    void onToggleMicrophone();
                  }}
                  className="flex min-h-11 w-full items-center justify-between rounded-xl px-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  <span>Micrófono</span>

                  <span
                    className={
                      microphoneEnabled
                        ? "text-emerald-300"
                        : "text-white/40"
                    }
                  >
                    {microphoneEnabled
                      ? "ON"
                      : "OFF"}
                  </span>
                </button>
              ) : null}

              <div className="mx-3 my-1 border-t border-white/10" />

              <div className="flex items-center justify-between px-3 py-2 text-[11px] font-bold">
                <span className="text-white/40">
                  Estado
                </span>

                <span className="text-emerald-300">
                  ● LIVE
                </span>
              </div>
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => {
              setControlsOpen(
                (current) => !current,
              );
            }}
            aria-expanded={controlsOpen}
            aria-label="Abrir controles de VYRO Battle"
            className="flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-black/85 px-4 text-xs font-black text-white shadow-2xl backdrop-blur-xl transition hover:bg-white/10"
          >
            <span
              className={`h-2 w-2 rounded-full ${
                cameraEnabled &&
                microphoneEnabled
                  ? "bg-emerald-400"
                  : "bg-amber-300"
              }`}
            />

            Controles
          </button>
        </div>
      ) : null}
    </section>
  );
}
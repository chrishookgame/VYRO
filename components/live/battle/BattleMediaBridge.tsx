"use client";

import {
  Room,
  RoomEvent,
  Track,
  type RemoteTrack,
  type RemoteTrackPublication,
  type RemoteParticipant,
} from "livekit-client";
import {
  useEffect,
  useRef,
  useState,
} from "react";

export type BattleMediaControls = {
  cameraEnabled: boolean;
  microphoneEnabled: boolean;
  mediaBusy: boolean;
  toggleCamera: () => Promise<void>;
  toggleMicrophone: () => Promise<void>;
};

type BattleMediaBridgeProps = {
  roomId: string;
  source: "watch" | "invitation-panel";
  onControlsReady?: (
    controls: BattleMediaControls | null,
  ) => void;
};

type TokenResponse = {
  success: boolean;
  token?: string;
  url?: string;
  error?: string;
};

export function BattleMediaBridge({
  roomId,
  source,
  onControlsReady,
}: BattleMediaBridgeProps) {
  const roomRef =
    useRef<Room | null>(null);

  useEffect(() => {
    console.info(
      "[VYRO BATTLE MEDIA] BRIDGE MOUNT",
      {
        source,
        roomId,
      },
    );

    return () => {
      console.info(
        "[VYRO BATTLE MEDIA] BRIDGE UNMOUNT",
        {
          source,
          roomId,
        },
      );
    };
  }, [roomId, source]);

  const localStreamRef =
    useRef<MediaStream | null>(null);

  const audioContainerRef =
    useRef<HTMLDivElement | null>(null);

  const [connected, setConnected] =
    useState(false);

  const [cameraEnabled, setCameraEnabled] =
    useState(true);

  const [
    microphoneEnabled,
    setMicrophoneEnabled,
  ] = useState(true);

  const [mediaBusy, setMediaBusy] =
    useState(false);


  const [error, setError] =
    useState("");

  const toggleCamera = async () => {
    const room = roomRef.current;

    if (!room || mediaBusy) {
      return;
    }

    const nextEnabled = !cameraEnabled;

    try {
      setMediaBusy(true);
      setError("");

      await room.localParticipant
        .setCameraEnabled(nextEnabled);

      setCameraEnabled(nextEnabled);
    }
    catch (cameraError) {
      console.error(
        "VYRO Battle camera control error:",
        cameraError,
      );

      setError(
        "No fue posible cambiar la cámara Battle.",
      );
    }
    finally {
      setMediaBusy(false);
    }
  };

  const toggleMicrophone = async () => {
    const room = roomRef.current;

    if (!room || mediaBusy) {
      return;
    }

    const nextEnabled =
      !microphoneEnabled;

    try {
      setMediaBusy(true);
      setError("");

      await room.localParticipant
        .setMicrophoneEnabled(nextEnabled);

      setMicrophoneEnabled(nextEnabled);
    }
    catch (microphoneError) {
      console.error(
        "VYRO Battle microphone control error:",
        microphoneError,
      );

      setError(
        "No fue posible cambiar el micrófono Battle.",
      );
    }
    finally {
      setMediaBusy(false);
    }
  };

  useEffect(() => {
    if (!onControlsReady) {
      return;
    }

    if (!connected) {
      onControlsReady(null);
      return;
    }

    onControlsReady({
      cameraEnabled,
      microphoneEnabled,
      mediaBusy,
      toggleCamera,
      toggleMicrophone,
    });

    return () => {
      onControlsReady(null);
    };
  }, [
    connected,
    cameraEnabled,
    microphoneEnabled,
    mediaBusy,
    onControlsReady,
  ]);

  useEffect(() => {
    let disposed = false;

    const room = new Room({
      adaptiveStream: true,
      dynacast: true,
    });

    roomRef.current = room;

    const attachRemoteAudio = (
      track: RemoteTrack,
      _publication: RemoteTrackPublication,
      participant: RemoteParticipant,
    ) => {
      if (
        track.kind !== Track.Kind.Audio ||
        !participant.identity.startsWith("host:")
      ) {
        return;
      }

      const container =
        audioContainerRef.current;

      if (!container) {
        return;
      }

      const element =
        track.attach();

      element.autoplay = true;
      element.dataset.vyroBattleAudio =
        participant.identity;

      console.info(
        "[VYRO BATTLE AUDIO][RIVAL] HOST AUDIO ATTACHED",
        {
          identity: participant.identity,
          kind: track.kind,
          muted: track.isMuted,
          elementPaused: element.paused,
          autoplay: element.autoplay,
        },
      );

      container.appendChild(element);
    };

    const detachRemoteAudio = (
      track: RemoteTrack,
      _publication: RemoteTrackPublication,
      participant: RemoteParticipant,
    ) => {
      if (
        track.kind !== Track.Kind.Audio ||
        !participant.identity.startsWith("host:")
      ) {
        return;
      }

      track.detach();
    };

    room.on(
      RoomEvent.TrackSubscribed,
      attachRemoteAudio,
    );

    room.on(
      RoomEvent.TrackUnsubscribed,
      detachRemoteAudio,
    );

    const connect = async () => {
      let localStream:
        MediaStream | null = null;

      try {
        setError("");

        const response =
          await fetch(
            "/api/live/token",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                roomId,
                role: "battle",
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
              "No fue posible obtener acceso Battle.",
          );
        }

        if (disposed) {
          await room.disconnect();
          return;
        }

        console.info(
          "[VYRO BATTLE MEDIA] CONNECT START",
          {
            roomId,
          },
        );

        await room.connect(
          payload.url,
          payload.token,
        );

        console.info(
          "[VYRO BATTLE MEDIA] CONNECT OK",
          {
            roomId,
            identity:
              room.localParticipant.identity,
          },
        );

        if (disposed) {
          await room.disconnect();
          return;
        }

        console.info(
          "[VYRO BATTLE MEDIA] GET USER MEDIA START",
        );

        localStream =
          await navigator.mediaDevices
            .getUserMedia({
              video: true,
              audio: true,
            });

        console.info(
          "[VYRO BATTLE MEDIA] GET USER MEDIA OK",
          {
            videoTracks:
              localStream.getVideoTracks().length,
            audioTracks:
              localStream.getAudioTracks().length,
          },
        );

        if (disposed) {
          localStream
            .getTracks()
            .forEach(
              (track) => track.stop(),
            );

          await room.disconnect();
          return;
        }

        localStreamRef.current =
          localStream;

        const videoTrack =
          localStream
            .getVideoTracks()[0];

        const audioTrack =
          localStream
            .getAudioTracks()[0];

        if (videoTrack) {
          console.info(
            "[VYRO BATTLE MEDIA] CAMERA PUBLISH START",
            {
              readyState:
                videoTrack.readyState,
              enabled:
                videoTrack.enabled,
            },
          );

          const cameraPublication =
            await room
              .localParticipant
              .publishTrack(
                videoTrack,
                {
                  name:
                    "vyro-battle-camera",
                  source:
                    Track.Source.Camera,
                  simulcast: true,
                },
              );

          console.info(
            "[VYRO BATTLE MEDIA] CAMERA PUBLISH OK",
            {
              trackSid:
                cameraPublication.trackSid,
              source:
                cameraPublication.source,
            },
          );
        }

        if (audioTrack) {
          console.info(
            "[VYRO BATTLE MEDIA] MICROPHONE PUBLISH START",
            {
              readyState:
                audioTrack.readyState,
              enabled:
                audioTrack.enabled,
            },
          );

          const microphonePublication =
            await room
              .localParticipant
              .publishTrack(
                audioTrack,
                {
                  name:
                    "vyro-battle-microphone",
                  source:
                    Track.Source.Microphone,
                },
              );

          console.info(
            "[VYRO BATTLE MEDIA] MICROPHONE PUBLISH OK",
            {
              trackSid:
                microphonePublication.trackSid,
              source:
                microphonePublication.source,
            },
          );
        }

        if (!disposed) {
          setConnected(true);
        }

        room.remoteParticipants.forEach(
          (participant) => {
            participant
              .trackPublications
              .forEach(
                (publication) => {
                  const track =
                    publication.track;

                  if (
                    track &&
                    track.kind ===
                      Track.Kind.Audio &&
                    participant.identity
                      .startsWith("host:")
                  ) {
                    attachRemoteAudio(
                      track,
                      publication,
                      participant,
                    );
                  }
                },
              );
          },
        );
      }
      catch (connectError) {
        console.error(
          "VYRO Battle Media error:",
          connectError,
        );

        if (!disposed) {
          setConnected(false);
          setError(
            connectError instanceof Error
              ? connectError.message
              : "No fue posible conectar VYRO Battle Media.",
          );
        }

        localStream
          ?.getTracks()
          .forEach(
            (track) => track.stop(),
          );

        await room.disconnect();
      }
    };

    void connect();

    return () => {
      disposed = true;

      room.off(
        RoomEvent.TrackSubscribed,
        attachRemoteAudio,
      );

      room.off(
        RoomEvent.TrackUnsubscribed,
        detachRemoteAudio,
      );

      localStreamRef.current
        ?.getTracks()
        .forEach(
          (track) => track.stop(),
        );

      localStreamRef.current = null;

      roomRef.current = null;

      void room.disconnect();
    };
  }, [roomId]);

  return (
    <>
      <div
        ref={audioContainerRef}
        className="hidden"
        aria-hidden="true"
      />

      {error ? (
        <div
          role="alert"
          className="rounded-xl border border-red-500/25 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-200"
        >
          {error}
        </div>
      ) : null}

      {!error && connected ? (
        <>
          <span className="sr-only">
            VYRO Battle Media conectado
          </span>
        </>
      ) : null}
    </>
  );
}
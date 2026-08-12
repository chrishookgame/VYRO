"use client";

import {
  Room,
  RoomEvent,
  Track,
  type LocalTrackPublication,
} from "livekit-client";
import {
  useEffect,
  useRef,
  useState,
} from "react";

type GuestPermissions = {
  canPublishCamera: boolean;
  canPublishMicrophone: boolean;
  canShareScreen: boolean;
};

type LiveGuestMediaProps = {
  roomId: string;
};

type TokenResponse = {
  success: boolean;
  token?: string;
  url?: string;
  error?: string;
  guestPermissions?: GuestPermissions | null;
};

export function LiveGuestMedia({
  roomId,
}: LiveGuestMediaProps) {
  const videoRef =
    useRef<HTMLVideoElement>(null);

  const roomRef =
    useRef<Room | null>(null);

  const streamRef =
    useRef<MediaStream | null>(null);

  const [
    permissions,
    setPermissions,
  ] = useState<GuestPermissions | null>(
    null,
  );

  const [
    connecting,
    setConnecting,
  ] = useState(true);

  const [
    connected,
    setConnected,
  ] = useState(false);

  const [
    cameraEnabled,
    setCameraEnabled,
  ] = useState(false);

  const [
    microphoneEnabled,
    setMicrophoneEnabled,
  ] = useState(false);

  const [
    screenShareEnabled,
    setScreenShareEnabled,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    let disposed = false;

    const videoElement =
      videoRef.current;

    const room = new Room({
      adaptiveStream: true,
      dynacast: true,
    });

    roomRef.current = room;

    const handleDisconnected = () => {
      if (!disposed) {
        setConnected(false);
        setScreenShareEnabled(false);
      }
    };

    room.on(
      RoomEvent.Disconnected,
      handleDisconnected,
    );

    const connect = async () => {
      setConnecting(true);
      setError("");

      let localStream:
        MediaStream | null =
        null;

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
              role: "guest",
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
              "No fue posible obtener acceso Guest.",
          );
        }

        const guestPermissions =
          payload.guestPermissions;

        if (!guestPermissions) {
          throw new Error(
            "VYRO no recibió los permisos multimedia del invitado.",
          );
        }

        if (disposed) {
          return;
        }

        setPermissions(
          guestPermissions,
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

        localStream =
          await navigator.mediaDevices
            .getUserMedia({
              video:
                guestPermissions
                  .canPublishCamera,
              audio:
                guestPermissions
                  .canPublishMicrophone,
            });

        if (disposed) {
          localStream
            .getTracks()
            .forEach(
              (track) => {
                track.stop();
              },
            );

          await room.disconnect();
          return;
        }

        streamRef.current =
          localStream;

        const videoTrack =
          localStream
            .getVideoTracks()[0];

        const audioTrack =
          localStream
            .getAudioTracks()[0];

        if (
          videoTrack &&
          guestPermissions
            .canPublishCamera
        ) {
          await room
            .localParticipant
            .publishTrack(
              videoTrack,
              {
                name:
                  "vyro-guest-camera",
                source:
                  Track.Source.Camera,
                simulcast: true,
              },
            );

          setCameraEnabled(true);
        }

        if (
          audioTrack &&
          guestPermissions
            .canPublishMicrophone
        ) {
          await room
            .localParticipant
            .publishTrack(
              audioTrack,
              {
                name:
                  "vyro-guest-microphone",
                source:
                  Track.Source.Microphone,
              },
            );

          setMicrophoneEnabled(true);
        }

        if (
          videoElement &&
          videoTrack
        ) {
          videoElement.srcObject =
            localStream;

          await videoElement.play();
        }
      } catch (connectError) {
        console.error(
          "VYRO Guest Media Core error:",
          connectError,
        );

        localStream
          ?.getTracks()
          .forEach(
            (track) => {
              track.stop();
            },
          );

        await room.disconnect();

        if (!disposed) {
          setConnected(false);
          setCameraEnabled(false);
          setMicrophoneEnabled(false);
          setScreenShareEnabled(false);

          setError(
            connectError instanceof Error
              ? connectError.message
              : "No fue posible conectar como invitado.",
          );
        }
      } finally {
        if (!disposed) {
          setConnecting(false);
        }
      }
    };

    void connect();

    return () => {
      disposed = true;

      room.off(
        RoomEvent.Disconnected,
        handleDisconnected,
      );

      const publications:
        LocalTrackPublication[] =
        Array.from(
          room.localParticipant
            .trackPublications
            .values(),
        );

      publications.forEach(
        (publication) => {
          if (publication.track) {
            void room
              .localParticipant
              .unpublishTrack(
                publication.track,
              );
          }
        },
      );

      streamRef.current
        ?.getTracks()
        .forEach(
          (track) => {
            track.stop();
          },
        );

      streamRef.current = null;

      if (videoElement) {
        videoElement.srcObject =
          null;
      }

      roomRef.current = null;

      void room.disconnect();
    };
  }, [roomId]);

  function toggleCamera() {
    const videoTrack =
      streamRef.current
        ?.getVideoTracks()[0];

    if (
      !videoTrack ||
      !permissions?.canPublishCamera
    ) {
      return;
    }

    const nextEnabled =
      !videoTrack.enabled;

    videoTrack.enabled =
      nextEnabled;

    setCameraEnabled(
      nextEnabled,
    );
  }

  function toggleMicrophone() {
    const audioTrack =
      streamRef.current
        ?.getAudioTracks()[0];

    if (
      !audioTrack ||
      !permissions
        ?.canPublishMicrophone
    ) {
      return;
    }

    const nextEnabled =
      !audioTrack.enabled;

    audioTrack.enabled =
      nextEnabled;

    setMicrophoneEnabled(
      nextEnabled,
    );
  }

  async function toggleScreenShare() {
    const room =
      roomRef.current;

    if (
      !room ||
      !permissions?.canShareScreen
    ) {
      return;
    }

    setError("");

    try {
      const nextEnabled =
        !screenShareEnabled;

      await room
        .localParticipant
        .setScreenShareEnabled(
          nextEnabled,
        );

      setScreenShareEnabled(
        nextEnabled,
      );
    } catch (screenError) {
      console.error(
        "VYRO Guest screen share error:",
        screenError,
      );

      setError(
        screenError instanceof Error
          ? screenError.message
          : "No fue posible compartir la pantalla.",
      );
    }
  }

  return (
    <section className="overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-[#05070A] shadow-2xl">
      <div className="relative aspect-video min-h-[320px] bg-black">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="h-full w-full object-contain"
        />

        {!connected ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 px-6 text-center">
            <div>
              <div className="mx-auto h-16 w-16 animate-pulse rounded-full border border-cyan-400/30 bg-cyan-400/10" />

              <p className="mt-5 text-lg font-black text-white">
                {connecting
                  ? "Preparando tu entrada al LIVE..."
                  : "Guest desconectado"}
              </p>

              {error ? (
                <p className="mx-auto mt-3 max-w-lg text-sm text-red-300">
                  {error}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2">
          <span className="rounded-full border border-cyan-300/30 bg-cyan-500/80 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-white backdrop-blur-xl">
            VYRO GUEST
          </span>

          {connected ? (
            <span className="rounded-full border border-red-400/30 bg-red-500/80 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-white">
              LIVE
            </span>
          ) : null}
        </div>
      </div>

      {connected ? (
        <div className="grid gap-3 border-t border-white/10 bg-[#08111C] p-4 sm:grid-cols-3">
          <button
            type="button"
            disabled={
              !permissions
                ?.canPublishCamera
            }
            onClick={
              toggleCamera
            }
            className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 font-bold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
          >
            {cameraEnabled
              ? "Apagar cámara"
              : "Encender cámara"}
          </button>

          <button
            type="button"
            disabled={
              !permissions
                ?.canPublishMicrophone
            }
            onClick={
              toggleMicrophone
            }
            className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 font-bold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
          >
            {microphoneEnabled
              ? "Silenciar micrófono"
              : "Activar micrófono"}
          </button>

          <button
            type="button"
            disabled={
              !permissions
                ?.canShareScreen
            }
            onClick={() => {
              void toggleScreenShare();
            }}
            className="rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 font-bold text-cyan-200 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-30"
          >
            {screenShareEnabled
              ? "Detener pantalla"
              : "Compartir pantalla"}
          </button>
        </div>
      ) : null}

      {error && connected ? (
        <div className="border-t border-red-500/20 bg-red-500/10 px-5 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}
    </section>
  );
}
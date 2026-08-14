"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

type LiveGuestWaitingPreviewProps = {
  canUseCamera: boolean;
  canUseMicrophone: boolean;
};

export function LiveGuestWaitingPreview({
  canUseCamera,
  canUseMicrophone,
}: LiveGuestWaitingPreviewProps) {
  const videoRef =
    useRef<HTMLVideoElement>(null);

  const streamRef =
    useRef<MediaStream | null>(null);

  const [cameraEnabled, setCameraEnabled] =
    useState(canUseCamera);

  const [
    microphoneEnabled,
    setMicrophoneEnabled,
  ] = useState(canUseMicrophone);

  const [ready, setReady] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let disposed = false;

    async function preparePreview() {
      if (
        !canUseCamera &&
        !canUseMicrophone
      ) {
        setReady(true);
        return;
      }

      try {
        const stream =
          await navigator.mediaDevices.getUserMedia({
            video: canUseCamera,
            audio: canUseMicrophone,
          });

        if (disposed) {
          stream
            .getTracks()
            .forEach((track) => {
              track.stop();
            });

          return;
        }

        streamRef.current = stream;

        const videoTrack =
          stream.getVideoTracks()[0];

        const audioTrack =
          stream.getAudioTracks()[0];

        if (videoTrack) {
          videoTrack.enabled =
            canUseCamera;
        }

        if (audioTrack) {
          audioTrack.enabled =
            canUseMicrophone;
        }

        if (
          videoRef.current &&
          videoTrack
        ) {
          videoRef.current.srcObject =
            stream;
        }

        setReady(true);
      }
      catch (previewError) {
        console.error(
          "VYRO Waiting Preview error:",
          previewError,
        );

        if (!disposed) {
          setError(
            "No fue posible preparar la cámara o el micrófono.",
          );

          setReady(true);
        }
      }
    }

    const videoElement =
      videoRef.current;

    void preparePreview();

    return () => {
      disposed = true;

      streamRef.current
        ?.getTracks()
        .forEach((track) => {
          track.stop();
        });

      streamRef.current = null;

      if (videoElement) {
        videoElement.srcObject =
          null;
      }
    };
  }, [
    canUseCamera,
    canUseMicrophone,
  ]);

  function toggleCamera() {
    const track =
      streamRef.current
        ?.getVideoTracks()[0];

    if (!track || !canUseCamera) {
      return;
    }

    const nextEnabled =
      !track.enabled;

    track.enabled = nextEnabled;

    setCameraEnabled(nextEnabled);
  }

  function toggleMicrophone() {
    const track =
      streamRef.current
        ?.getAudioTracks()[0];

    if (
      !track ||
      !canUseMicrophone
    ) {
      return;
    }

    const nextEnabled =
      !track.enabled;

    track.enabled = nextEnabled;

    setMicrophoneEnabled(nextEnabled);
  }

  return (
    <section className="mb-5 overflow-hidden rounded-[2rem] border border-amber-300/20 bg-gradient-to-br from-amber-300/[0.07] via-[#080B12] to-black shadow-2xl">
      <div className="border-b border-white/10 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-300">
              VYRO WAITING ROOM
            </p>

            <p className="mt-1 text-sm font-black text-white">
              Preparación antes de subir al Stage
            </p>
          </div>

          <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.14em] text-amber-200">
            PRIVADO
          </span>
        </div>
      </div>

      <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black">
          <div className="aspect-video">
            {canUseCamera ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center px-6 text-center">
                <p className="text-sm font-bold text-white/40">
                  Cámara no habilitada para esta invitación.
                </p>
              </div>
            )}
          </div>

          {!cameraEnabled &&
          canUseCamera ? (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/80">
              <p className="text-sm font-black uppercase tracking-[0.14em] text-white/50">
                Cámara apagada
              </p>
            </div>
          ) : null}

          {!ready ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80">
              <p className="text-sm font-black text-white/60">
                Preparando dispositivos...
              </p>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col justify-between gap-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-white/40">
              Antes de entrar
            </p>

            <p className="mt-2 text-sm leading-6 text-white/55">
              Puedes comprobar tu cámara y micrófono mientras esperas. Tu preview es local y todavía no estás publicado en el Stage.
            </p>
          </div>

          <div className="grid gap-2">
            <button
              type="button"
              disabled={!canUseCamera}
              onClick={toggleCamera}
              className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-black text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
            >
              {cameraEnabled
                ? "Apagar cámara"
                : "Encender cámara"}
            </button>

            <button
              type="button"
              disabled={!canUseMicrophone}
              onClick={toggleMicrophone}
              className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-black text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
            >
              {microphoneEnabled
                ? "Silenciar micrófono"
                : "Activar micrófono"}
            </button>
          </div>
        </div>
      </div>

      {error ? (
        <div className="border-t border-red-400/15 bg-red-400/[0.05] px-5 py-4">
          <p className="text-sm font-semibold text-red-200">
            {error}
          </p>
        </div>
      ) : null}

      <div className="border-t border-white/10 px-5 py-4">
        <p className="text-xs font-semibold text-white/35">
          Estás en espera. El creador controla cuándo apareces en el LIVE.
        </p>
      </div>
    </section>
  );
}
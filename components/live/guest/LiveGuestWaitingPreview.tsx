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
    <section className="overflow-hidden rounded-2xl border border-white/15 bg-[#080B12]/95 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-3 py-2.5">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 shrink-0 rounded-full bg-amber-300" />
            <p className="truncate text-[10px] font-black uppercase tracking-[0.14em] text-white">
              Preparar Stage
            </p>
          </div>
          <p className="mt-0.5 text-[10px] font-semibold text-white/40">
            Preview privado
          </p>
        </div>

        <span className="shrink-0 rounded-full border border-amber-300/20 bg-amber-300/10 px-2 py-1 text-[8px] font-black uppercase tracking-[0.1em] text-amber-200">
          En espera
        </span>
      </div>

      <div className="p-2.5">
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black">
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
              <div className="flex h-full items-center justify-center px-4 text-center">
                <p className="text-xs font-bold text-white/40">
                  Cámara no habilitada
                </p>
              </div>
            )}
          </div>

          {!cameraEnabled &&
          canUseCamera ? (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/80">
              <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white/55">
                Cámara apagada
              </p>
            </div>
          ) : null}

          {!ready ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80">
              <p className="text-xs font-black text-white/60">
                Preparando...
              </p>
            </div>
          ) : null}
        </div>

        <div className="mt-2.5 grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={!canUseCamera}
            onClick={toggleCamera}
            className={`rounded-xl border px-2 py-2 text-[10px] font-black transition disabled:cursor-not-allowed disabled:opacity-30 ${
              cameraEnabled
                ? "border-cyan-300/25 bg-cyan-300/10 text-cyan-100"
                : "border-white/10 bg-white/[0.05] text-white/50"
            }`}
          >
            {cameraEnabled ? "Cámara ON" : "Cámara OFF"}
          </button>

          <button
            type="button"
            disabled={!canUseMicrophone}
            onClick={toggleMicrophone}
            className={`rounded-xl border px-2 py-2 text-[10px] font-black transition disabled:cursor-not-allowed disabled:opacity-30 ${
              microphoneEnabled
                ? "border-cyan-300/25 bg-cyan-300/10 text-cyan-100"
                : "border-white/10 bg-white/[0.05] text-white/50"
            }`}
          >
            {microphoneEnabled
              ? "Micrófono ON"
              : "Micrófono OFF"}
          </button>
        </div>

        {error ? (
          <div className="mt-2 rounded-xl border border-red-400/15 bg-red-400/[0.06] px-2.5 py-2">
            <p className="text-[10px] font-semibold text-red-200">
              {error}
            </p>
          </div>
        ) : null}

        <div className="mt-2.5 flex items-center justify-between border-t border-white/10 pt-2.5">
          <p className="text-[10px] font-semibold text-white/40">
            Esperando al creador
          </p>

          <span className="text-[9px] font-black tracking-[0.12em] text-white/25">
            VYRO
          </span>
        </div>
      </div>
    </section>
  );
}
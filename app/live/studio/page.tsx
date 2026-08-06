"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  CameraOff,
  Mic,
  MicOff,
  MonitorUp,
  Radio,
  Settings,
  Square,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
  BattleStudio,
  type BattleSeriesConfig,
} from "@/components/live/battle";
import { LiveCommandCenter } from "@/components/live/command-center";
import {
  useBattleInvitations,
  useLiveDashboard,
  useLiveSession,
} from "@/hooks";
import {
  createLiveBattleSeries,
  getActiveLiveBattleSeries,
} from "@/lib/live-battle-series";

function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => value.toString().padStart(2, "0"))
    .join(":");
}

export default function LiveStudioPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const {
    session,
    error: sessionError,
    createSession,
    startSession,
    endSession,
    clearError: clearSessionError,
  } = useLiveSession();

  const {
    dashboard,
    connected: dashboardConnected,
    error: dashboardError,
  } = useLiveDashboard(
    session?.id,
  );

  const {
    received: receivedBattleInvitations,
    sent: sentBattleInvitations,
    loading: battleInvitationsLoading,
    error: battleInvitationsError,
  } = useBattleInvitations();
  const [devicesReady, setDevicesReady] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [microphoneEnabled, setMicrophoneEnabled] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [liveDuration, setLiveDuration] = useState(0);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Creator");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [
    creatingBattleSeries,
    setCreatingBattleSeries,
  ] = useState(false);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);
  useEffect(() => {
    if (!session) {
      return;
    }

    setTitle(session.title);

    const sessionIsLive =
      session.status === "live" ||
      session.status === "active";

    setIsLive(sessionIsLive);

    if (sessionIsLive && session.startedAt) {
      const elapsedSeconds = Math.max(
        0,
        Math.floor(
          (
            Date.now() -
            new Date(session.startedAt).getTime()
          ) / 1000,
        ),
      );

      setLiveDuration(elapsedSeconds);
    }
  }, [session]);

  useEffect(() => {
    if (!isLive) {
      return;
    }

    const timer = window.setInterval(() => {
      setLiveDuration((currentDuration) => currentDuration + 1);
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [isLive]);

  async function startDevices() {
    setError("");
    setMessage("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setDevicesReady(true);
      setCameraEnabled(true);
      setMicrophoneEnabled(true);
    } catch (deviceError) {
      console.error("VYRO LIVE device error:", deviceError);

      setDevicesReady(false);
      setCameraEnabled(false);
      setMicrophoneEnabled(false);

      setError(
        "No fue posible acceder a la cámara o al micrófono. Revisa los permisos del navegador.",
      );
    }
  }

  function toggleCamera() {
    const videoTrack = streamRef.current?.getVideoTracks()[0];

    if (!videoTrack) {
      void startDevices();
      return;
    }

    videoTrack.enabled = !videoTrack.enabled;
    setCameraEnabled(videoTrack.enabled);
  }

  function toggleMicrophone() {
    const audioTrack = streamRef.current?.getAudioTracks()[0];

    if (!audioTrack) {
      void startDevices();
      return;
    }

    audioTrack.enabled = !audioTrack.enabled;
    setMicrophoneEnabled(audioTrack.enabled);
  }

  async function shareScreen() {
    setError("");
    setMessage("");

    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = screenStream;
      }

      screenStream.getVideoTracks()[0]?.addEventListener("ended", () => {
        if (videoRef.current && streamRef.current) {
          videoRef.current.srcObject = streamRef.current;
        }
      });
    } catch (screenError) {
      console.error("VYRO LIVE screen share error:", screenError);
      setError("No se pudo compartir la pantalla.");
    }
  }

  async function handleCreateBattleSeries(
    config: BattleSeriesConfig,
  ) {
    setError("");
    setMessage("");

    if (!session) {
      setError(
        "Primero debes crear o iniciar una sala VYRO LIVE.",
      );
      return;
    }

    const acceptedInvitation = [
      ...receivedBattleInvitations,
      ...sentBattleInvitations,
    ]
      .filter(
        (invitation) =>
          invitation.status === "accepted" &&
          invitation.roomId === session.id &&
          (
            invitation.senderId === session.hostId ||
            invitation.receiverId === session.hostId
          ),
      )
      .sort(
        (left, right) =>
          new Date(
            right.acceptedAt ??
              right.updatedAt,
          ).getTime() -
          new Date(
            left.acceptedAt ??
              left.updatedAt,
          ).getTime(),
      )[0];

    if (!acceptedInvitation) {
      setError(
        "Necesitas una invitación de batalla aceptada para esta sala.",
      );
      return;
    }

    const rivalId =
      acceptedInvitation.senderId ===
      session.hostId
        ? acceptedInvitation.receiverId
        : acceptedInvitation.senderId;

    setCreatingBattleSeries(true);

    try {
      const activeSeries =
        await getActiveLiveBattleSeries(
          session.id,
        );

      if (activeSeries) {
        setError(
          "Esta sala ya tiene una Battle Series activa.",
        );
        return;
      }

      const createdSeries =
        await createLiveBattleSeries({
          roomId: session.id,
          leftCreatorId:
            session.hostId,
          rightCreatorId:
            rivalId,
          invitationId:
            acceptedInvitation.id,
          config,
        });

      setMessage(
        `Battle Series creada correctamente. ID: ${createdSeries.row.id}`,
      );
    } catch (seriesError) {
      setError(
        seriesError instanceof Error
          ? seriesError.message
          : "No se pudo crear la Battle Series.",
      );
    } finally {
      setCreatingBattleSeries(false);
    }
  }

  async function startLive() {
    setError("");
    setMessage("");
    clearSessionError();

    if (!devicesReady || !cameraEnabled) {
      setError(
        "Activa la cámara antes de iniciar VYRO LIVE.",
      );
      return;
    }

    if (!title.trim()) {
      setError(
        "Escribe un título para la transmisión.",
      );
      return;
    }

    let targetSession = session;

    if (
      !targetSession ||
      targetSession.status === "ended" ||
      targetSession.status === "cancelled"
    ) {
      targetSession = await createSession({
        title,
        description: `Categoría: ${category}`,
      });
    }

    if (!targetSession) {
      return;
    }

    const startedSession =
      targetSession.status === "live" ||
      targetSession.status === "active"
        ? targetSession
        : await startSession(targetSession.id);

    if (!startedSession) {
      return;
    }

    setLiveDuration(0);
    setIsLive(true);

    setMessage(
      `VYRO LIVE iniciado correctamente. Sala: ${startedSession.id}`,
    );
  }

  async function stopLive() {
    setError("");
    setMessage("");
    clearSessionError();

    const endedSession = await endSession();

    if (!endedSession) {
      return;
    }

    setIsLive(false);

    setMessage(
      `Transmisión finalizada. Duración total: ${formatDuration(liveDuration)}.`,
    );
  }

  return (
    <main className="min-h-screen bg-[#05070A] px-6 py-8 text-white md:px-10">
      <section className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            href="/live"
            className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 transition hover:text-cyan-300"
          >
            <ArrowLeft size={18} />
            Volver a VYRO LIVE
          </Link>

          <div className="flex items-center gap-3">
            {isLive ? (
              <>
                <span className="font-mono text-sm text-gray-300">
                  {formatDuration(liveDuration)}
                </span>

                <span className="animate-pulse rounded-full border border-red-500/40 bg-red-500/15 px-4 py-2 text-sm font-bold text-red-300">
                  ● LIVE
                </span>
              </>
            ) : (
              <span className="rounded-full border border-gray-500/30 bg-white/5 px-4 py-2 text-sm font-bold text-gray-300">
                ● OFFLINE
              </span>
            )}
          </div>
        </div>

        <header className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-[#0B1220] to-[#111827] p-8">
          <p className="font-bold uppercase tracking-[0.35em] text-cyan-400">
            VYRO LIVE STUDIO
          </p>

          <h1 className="mt-4 text-4xl font-black md:text-5xl">
            Prepara tu transmisión
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-400">
            Configura cámara, micrófono, pantalla e invitados antes de iniciar
            tu directo dentro del ecosistema VYRO.
          </p>
        </header>

        {(error || sessionError || dashboardError || battleInvitationsError) ? (
          <div
            role="alert"
            className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-200"
          >
            {error || sessionError || dashboardError || battleInvitationsError}
          </div>
        ) : null}

        {message ? (
          <div
            aria-live="polite"
            className="mt-6 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 px-5 py-4 text-cyan-100"
          >
            {message}
          </div>
        ) : null}

        <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-3">
          <section className="xl:col-span-2">
            <div className="relative flex min-h-[520px] items-center justify-center overflow-hidden rounded-3xl border border-cyan-500/20 bg-black">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="h-full min-h-[520px] w-full object-cover"
              />

              {isLive ? (
                <div className="absolute left-5 top-5 rounded-full bg-red-500 px-4 py-2 text-sm font-black text-white shadow-lg">
                  VYRO LIVE
                </div>
              ) : null}

              {!devicesReady ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black">
                  <div className="text-center">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-cyan-500/10">
                      <Camera size={48} className="text-cyan-400" />
                    </div>

                    <h2 className="mt-6 text-2xl font-bold">
                      Vista previa de cámara
                    </h2>

                    <p className="mt-3 text-gray-400">
                      Activa tus dispositivos para comenzar.
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        void startDevices();
                      }}
                      className="mt-6 rounded-2xl bg-cyan-500 px-6 py-3 font-bold text-black transition hover:bg-cyan-400"
                    >
                      Activar cámara y micrófono
                    </button>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
              <button
                type="button"
                onClick={toggleCamera}
                disabled={isLive}
                className="rounded-2xl border border-white/10 bg-[#111827] p-4 transition hover:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {cameraEnabled ? (
                  <Camera className="mx-auto text-cyan-400" />
                ) : (
                  <CameraOff className="mx-auto text-red-400" />
                )}

                <span className="mt-2 block text-sm font-semibold">
                  {cameraEnabled ? "Cámara activa" : "Cámara apagada"}
                </span>
              </button>

              <button
                type="button"
                onClick={toggleMicrophone}
                className="rounded-2xl border border-white/10 bg-[#111827] p-4 transition hover:border-cyan-400"
              >
                {microphoneEnabled ? (
                  <Mic className="mx-auto text-cyan-400" />
                ) : (
                  <MicOff className="mx-auto text-red-400" />
                )}

                <span className="mt-2 block text-sm font-semibold">
                  {microphoneEnabled ? "Micrófono activo" : "Micrófono apagado"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  void shareScreen();
                }}
                disabled={!devicesReady}
                className="rounded-2xl border border-white/10 bg-[#111827] p-4 transition hover:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <MonitorUp className="mx-auto text-cyan-400" />

                <span className="mt-2 block text-sm font-semibold">
                  Compartir pantalla
                </span>
              </button>

              <button
                type="button"
                className="rounded-2xl border border-white/10 bg-[#111827] p-4 transition hover:border-cyan-400"
              >
                <Settings className="mx-auto text-cyan-400" />

                <span className="mt-2 block text-sm font-semibold">
                  Ajustes
                </span>
              </button>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-cyan-500/20 bg-[#0B1220] p-6">
              <div className="flex items-center gap-3">
                <Radio className="text-cyan-400" />
                <h2 className="text-xl font-bold">Detalles del Live</h2>
              </div>

              <div className="mt-6 space-y-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-gray-300">
                    Título
                  </span>

                  <input
                    type="text"
                    value={title}
                    onChange={(event) => {
                      setTitle(event.target.value);
                    }}
                    disabled={isLive}
                    placeholder="Ejemplo: Lanzamiento VYRO"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-gray-300">
                    Categoría
                  </span>

                  <select
                    value={category}
                    onChange={(event) => {
                      setCategory(event.target.value);
                    }}
                    disabled={isLive}
                    className="w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 text-white outline-none transition focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option>Creator</option>
                    <option>Educación</option>
                    <option>Negocios</option>
                    <option>Evento</option>
                    <option>Comunidad</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="rounded-3xl border border-cyan-500/20 bg-[#0B1220] p-6">
              <div className="flex items-center gap-3">
                <Users className="text-cyan-400" />
                <h2 className="text-xl font-bold">Invitados</h2>
              </div>

              <p className="mt-3 text-sm leading-6 text-gray-400">
                Invita participantes y administra sus permisos dentro de VYRO
                LIVE.
              </p>

              <button
                type="button"
                disabled={isLive}
                className="mt-5 w-full rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-3 font-semibold text-cyan-300 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Añadir invitado
              </button>
            </div>

            {isLive ? (
              <button
                type="button"
                onClick={stopLive}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white py-4 font-black text-black transition hover:bg-gray-200"
              >
                <Square size={20} fill="currentColor" />
                Finalizar VYRO LIVE
              </button>
            ) : (
              <button
                type="button"
                onClick={startLive}
                disabled={!devicesReady || !cameraEnabled}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-red-500 py-4 font-black text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Radio />
                Iniciar VYRO LIVE
              </button>
            )}
          </aside>
        </div>
        <div className="mt-10">
          <BattleStudio
            disabled={
              !session ||
              battleInvitationsLoading ||
              creatingBattleSeries
            }
            onCreateSeries={(config) => {
              void handleCreateBattleSeries(
                config,
              );
            }}
          />
        </div>

        <div className="mt-10">
          <LiveCommandCenter
            activeViewers={
              dashboard.activeViewers
            }
            peakViewers={
              dashboard.peakViewers
            }
            totalJoins={
              dashboard.totalJoins
            }
            reactions={
              dashboard.reactions
            }
            gifts={
              dashboard.gifts
            }
            energy={
              dashboard.energy
            }
            messages={
              dashboard.messages
            }
            connected={
              isLive &&
              Boolean(session) &&
              dashboardConnected
            }
          />
        </div>
      </section>
    </main>
  );
}

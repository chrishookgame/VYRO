"use client";

import Link from "next/link";
import {
  LocalTrack,
  Room,
  Track,
} from "livekit-client";
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
  Clock3,
  LoaderCircle,
  Swords,
  Trophy,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  BattleStudio,
  type BattleSeriesConfig,
} from "@/components/live/battle";
import { LiveCommandCenter } from "@/components/live/command-center";
import { LiveGuestControlCenter } from "@/components/live/guest";
import { LiveProductionPanel } from "@/components/live/production/LiveProductionPanel";
import { VyroCreatorControlStrip } from "@/components/live/studio/VyroCreatorControlStrip";
import {
  useBattleCountdown,
  useBattleInvitations,
  useBattleSeriesHostController,
  useLiveBattle,
  useLiveBattleSeries,
  useLiveDashboard,
  useLiveSession,
} from "@/hooks";
import {
  createLiveBattleSeries,
  getActiveLiveBattleSeries,
  startLiveBattleRound,
} from "@/lib/live-battle-series";

type CreatorOnAirOverlay = {
  visible: boolean;
  eyebrow: string;
  title: string;
  message: string;
  cta: string;
};

function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => value.toString().padStart(2, "0"))
    .join(":");
}

export default function LiveStudioPage() {
  const [
    creatorOnAirOverlay,
    setCreatorOnAirOverlay,
  ] = useState<CreatorOnAirOverlay>({
    visible: false,
    eyebrow: "",
    title: "",
    message: "",
    cta: "",
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const liveKitRoomRef = useRef<Room | null>(null);
  const liveKitPublishedTracksRef = useRef<LocalTrack[]>([]);

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

  const {
    battle: activeBattle,
    loading: activeBattleLoading,
    error: activeBattleError,
    refresh: refreshActiveBattle,
  } = useLiveBattle(
    session?.id,
  );

  const {
    series: activeBattleSeries,
    loading: activeBattleSeriesLoading,
    error: activeBattleSeriesError,
    advanceRound,
    refresh: refreshActiveBattleSeries,
  } = useLiveBattleSeries(
    session?.id,
  );
  const [devicesReady, setDevicesReady] = useState(false);
  const [availableCameras, setAvailableCameras] =
    useState<MediaDeviceInfo[]>([]);
  const [availableMicrophones, setAvailableMicrophones] =
    useState<MediaDeviceInfo[]>([]);
  const [selectedCameraId, setSelectedCameraId] =
    useState("");
  const [selectedMicrophoneId, setSelectedMicrophoneId] =
    useState("");
  const [settingsOpen, setSettingsOpen] =
    useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [microphoneEnabled, setMicrophoneEnabled] = useState(false);
  const [screenShareEnabled, setScreenShareEnabled] = useState(false);
  const [liveKitRoom, setLiveKitRoom] =
    useState<Room | null>(null);
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

  const advanceAndRefreshBattle =
    useCallback(
      async (
        battleId: string,
      ) => {
        const nextSeries =
          await advanceRound(
            battleId,
          );

        if (!nextSeries) {
          return null;
        }

        await Promise.all([
          refreshActiveBattle(),
          refreshActiveBattleSeries(),
        ]);

        return nextSeries;
      },
      [
        advanceRound,
        refreshActiveBattle,
        refreshActiveBattleSeries,
      ],
    );

  const startAndRefreshBattle =
    useCallback(
      async (
        battleId: string,
      ) => {
        if (!activeBattleSeries) {
          return null;
        }

        const nextSeries =
          await startLiveBattleRound(
            activeBattleSeries.id,
            battleId,
          );

        await Promise.all([
          refreshActiveBattle(),
          refreshActiveBattleSeries(),
        ]);

        return nextSeries;
      },
      [
        activeBattleSeries,
        refreshActiveBattle,
        refreshActiveBattleSeries,
      ],
    );
  const {
    processing:
      battleSeriesProcessing,
    error:
      battleSeriesControllerError,
  } = useBattleSeriesHostController({
    enabled:
      Boolean(session) &&
      isLive &&
      !activeBattleLoading &&
      !activeBattleSeriesLoading,
    series:
      activeBattleSeries,
    battle:
      activeBattle,
    startRound:
      startAndRefreshBattle,
    advanceRound:
      advanceAndRefreshBattle,
  });

  const battleCountdownPhase =
    activeBattleSeries?.status ===
    "intermission"
      ? "intermission"
      : activeBattleSeries?.status ===
          "scheduled"
        ? "scheduled"
        : activeBattleSeries?.status ===
            "finished"
          ? "finished"
          : activeBattle?.status ===
              "active"
            ? "active"
            : "idle";

  const battleCountdownTarget =
    battleCountdownPhase ===
      "intermission" ||
    battleCountdownPhase ===
      "scheduled"
      ? activeBattleSeries
          ?.nextBattleAt ?? null
      : battleCountdownPhase ===
          "active"
        ? activeBattle?.endsAt ?? null
        : null;

  const battleSeriesCountdown =
    useBattleCountdown({
      phase:
        battleCountdownPhase,
      targetAt:
        battleCountdownTarget,
      enabled:
        Boolean(
          activeBattleSeries,
        ),
      tickIntervalMs: 250,
    });

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

  async function startDevices(
    cameraId = selectedCameraId,
    microphoneId = selectedMicrophoneId,
  ) {
    setError("");
    setMessage("");

    try {
      streamRef.current
        ?.getTracks()
        .forEach((track) => track.stop());

      streamRef.current = null;

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 500);
      });

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: cameraId
            ? {
                deviceId: {
                  exact: cameraId,
                },
              }
            : true,
          audio: microphoneId
            ? {
                deviceId: {
                  exact: microphoneId,
                },
              }
            : true,
        });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const devices =
        await navigator.mediaDevices.enumerateDevices();

      const cameras =
        devices.filter(
          (device) =>
            device.kind === "videoinput",
        );

      const microphones =
        devices.filter(
          (device) =>
            device.kind === "audioinput",
        );

      setAvailableCameras(cameras);
      setAvailableMicrophones(microphones);

      const videoDeviceId =
        stream
          .getVideoTracks()[0]
          ?.getSettings()
          .deviceId;

      const audioDeviceId =
        stream
          .getAudioTracks()[0]
          ?.getSettings()
          .deviceId;

      if (videoDeviceId) {
        setSelectedCameraId(videoDeviceId);
      }

      if (audioDeviceId) {
        setSelectedMicrophoneId(audioDeviceId);
      }

      setDevicesReady(true);
      setCameraEnabled(true);
      setMicrophoneEnabled(true);
    } catch (deviceError) {
      console.error(
        "VYRO LIVE device error:",
        deviceError,
      );

      setDevicesReady(false);
      setCameraEnabled(false);
      setMicrophoneEnabled(false);

      setError(
        "No fue posible acceder a la cámara o al micrófono. Revisa los permisos del navegador.",
      );
    }
  }
  async function toggleCamera() {
    setError("");

    const nextEnabled =
      !cameraEnabled;

    try {
      const room =
        liveKitRoomRef.current;

      if (isLive && room) {
        await room.localParticipant.setCameraEnabled(
          nextEnabled,
        );
      }
      else {
        const videoTrack =
          streamRef.current
            ?.getVideoTracks()[0];

        if (!videoTrack) {
          await startDevices();
          return;
        }

        videoTrack.enabled =
          nextEnabled;
      }

      setCameraEnabled(
        nextEnabled,
      );
    }
    catch (cameraError) {
      console.error(
        "VYRO LIVE camera control error:",
        cameraError,
      );

      setError(
        "No fue posible cambiar el estado de la cámara.",
      );
    }
  }

  async function toggleMicrophone() {
    setError("");

    const nextEnabled =
      !microphoneEnabled;

    try {
      const room =
        liveKitRoomRef.current;

      if (isLive && room) {
        await room.localParticipant.setMicrophoneEnabled(
          nextEnabled,
        );
      }
      else {
        const audioTrack =
          streamRef.current
            ?.getAudioTracks()[0];

        if (!audioTrack) {
          await startDevices();
          return;
        }

        audioTrack.enabled =
          nextEnabled;
      }

      setMicrophoneEnabled(
        nextEnabled,
      );
    }
    catch (microphoneError) {
      console.error(
        "VYRO LIVE microphone control error:",
        microphoneError,
      );

      setError(
        "No fue posible cambiar el estado del micrófono.",
      );
    }
  }

  async function shareScreen() {
    setError("");
    setMessage("");

    try {
      const room =
        liveKitRoomRef.current;

      if (isLive && room) {
        if (screenShareEnabled) {
          await room.localParticipant
            .setScreenShareEnabled(false);

          setScreenShareEnabled(false);

          if (
            videoRef.current &&
            streamRef.current
          ) {
            videoRef.current.srcObject =
              streamRef.current;
          }

          setMessage(
            "Compartir pantalla finalizado.",
          );

          return;
        }

        const publication =
          await room.localParticipant
            .setScreenShareEnabled(true);

        const screenTrack =
          publication?.videoTrack;

        if (
          screenTrack &&
          videoRef.current
        ) {
          screenTrack.attach(
            videoRef.current,
          );

          screenTrack.mediaStreamTrack
            .addEventListener(
              "ended",
              () => {
                void (
                  async () => {
                    try {
                      await room
                        .localParticipant
                        .setScreenShareEnabled(
                          false,
                        );
                    }
                    catch (
                      stopScreenError
                    ) {
                      console.error(
                        "VYRO LIVE screen stop error:",
                        stopScreenError,
                      );
                    }

                    setScreenShareEnabled(
                      false,
                    );

                    if (
                      videoRef.current &&
                      streamRef.current
                    ) {
                      videoRef.current
                        .srcObject =
                        streamRef.current;
                    }
                  }
                )();
              },
              {
                once: true,
              },
            );
        }

        setScreenShareEnabled(true);

        setMessage(
          "Pantalla compartida en VYRO LIVE.",
        );

        return;
      }

      const screenStream =
        await navigator.mediaDevices
          .getDisplayMedia({
            video: true,
            audio: true,
          });

      if (videoRef.current) {
        videoRef.current.srcObject =
          screenStream;
      }

      setScreenShareEnabled(true);

      screenStream
        .getVideoTracks()[0]
        ?.addEventListener(
          "ended",
          () => {
            setScreenShareEnabled(
              false,
            );

            if (
              videoRef.current &&
              streamRef.current
            ) {
              videoRef.current.srcObject =
                streamRef.current;
            }
          },
          {
            once: true,
          },
        );
    }
    catch (screenError) {
      console.error(
        "VYRO LIVE screen share error:",
        screenError,
      );

      setScreenShareEnabled(false);

      setError(
        "No se pudo compartir la pantalla.",
      );
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

      await Promise.all([
        refreshActiveBattle(),
        refreshActiveBattleSeries(),
      ]);

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

    const localStream = streamRef.current;

    if (!localStream) {
      setError(
        "No existe un stream local de cámara y micrófono.",
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

    let room: Room | null = null;
    const publishedTracks: LocalTrack[] = [];

    try {
      const response = await fetch(
        "/api/live/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roomId: targetSession.id,
            role: "host",
          }),
        },
      );

      const payload = (await response.json()) as {
        success: boolean;
        token?: string;
        url?: string;
        error?: string;
      };

      if (
        !response.ok ||
        !payload.success ||
        !payload.token ||
        !payload.url
      ) {
        throw new Error(
          payload.error ||
            "No fue posible obtener acceso al Media Core.",
        );
      }

      room = new Room({
        adaptiveStream: true,
        dynacast: true,
      });

      await room.connect(
        payload.url,
        payload.token,
      );

      const videoTrack =
        localStream.getVideoTracks()[0];

      const audioTrack =
        localStream.getAudioTracks()[0];

      if (!videoTrack) {
        throw new Error(
          "No existe una pista de cámara para transmitir.",
        );
      }

      const publishedVideo =
        await room.localParticipant.publishTrack(
          videoTrack,
          {
            name: "vyro-camera",
            source: Track.Source.Camera,
            simulcast: true,
          },
        );

      if (publishedVideo.track) {
        publishedTracks.push(
          publishedVideo.track,
        );
      }

      if (audioTrack) {
        const publishedAudio =
          await room.localParticipant.publishTrack(
            audioTrack,
            {
              name: "vyro-microphone",
              source: Track.Source.Microphone,
            },
          );

        if (publishedAudio.track) {
          publishedTracks.push(
            publishedAudio.track,
          );
        }
      }

      const startedSession =
        targetSession.status === "live" ||
        targetSession.status === "active"
          ? targetSession
          : await startSession(targetSession.id);

      if (!startedSession) {
        throw new Error(
          "Media Core conectado, pero VYRO no pudo activar la sala.",
        );
      }

      liveKitRoomRef.current = room;
      setLiveKitRoom(room);

      liveKitPublishedTracksRef.current =
        publishedTracks;

      setLiveDuration(0);
      setIsLive(true);

      setMessage(
        `VYRO LIVE conectado y transmitiendo. Sala: ${startedSession.id}`,
      );
    } catch (liveError) {
      if (room) {
        await room.disconnect();
      }

      liveKitRoomRef.current = null;
      liveKitPublishedTracksRef.current = [];

      console.error(
        "VYRO LIVE Media Core start failed:",
        liveError,
      );

      setError(
        liveError instanceof Error
          ? liveError.message
          : "No fue posible iniciar VYRO LIVE Media Core.",
      );
    }
  }

  async function stopLive() {
    setError("");
    setMessage("");
    clearSessionError();

    const room =
      liveKitRoomRef.current;

    liveKitRoomRef.current = null;
    setLiveKitRoom(null);

    liveKitPublishedTracksRef.current = [];

    if (room) {
      await room.disconnect();
    }

    const endedSession =
      await endSession();

    setIsLive(false);

    if (!endedSession) {
      return;
    }

    setMessage(
      `Transmisión finalizada. Duración total: ${formatDuration(liveDuration)}.`,
    );
  }
  return (
    <main className="min-h-screen bg-[#05070A] px-6 py-8 text-white md:px-10">
      <section className="mx-auto w-full max-w-[1440px]">
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

        {(
          error ||
          sessionError ||
          dashboardError ||
          battleInvitationsError ||
          activeBattleError ||
          activeBattleSeriesError ||
          battleSeriesControllerError
        ) ? (
          <div
            role="alert"
            className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-200"
          >
            {error ||
              sessionError ||
              dashboardError ||
              battleInvitationsError ||
              activeBattleError ||
              activeBattleSeriesError ||
              battleSeriesControllerError}
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

        <div className="mx-auto mt-8 grid w-full grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_420px] xl:gap-7">
          <section className="min-w-0">
            <div className="relative flex min-h-[500px] xl:min-h-[560px] items-center justify-center overflow-hidden rounded-3xl border border-cyan-500/20 bg-black">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="h-full min-h-[500px] xl:min-h-[560px] w-full object-cover"
              />

              {isLive &&
              creatorOnAirOverlay.visible ? (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30">
                  <div className="flex min-h-14 items-stretch border-t border-cyan-300/20 bg-black/55 shadow-[0_-10px_35px_rgba(0,0,0,0.20)] backdrop-blur-sm">
                    <div className="flex shrink-0 items-center bg-cyan-300 px-4 text-[10px] font-black uppercase tracking-[0.16em] text-black">
                      {creatorOnAirOverlay.eyebrow ||
                        "VYRO LIVE"}
                    </div>

                    <div className="relative flex min-w-0 flex-1 items-center overflow-hidden">
                      <div className="vyro-creator-tv-ticker-track flex w-max shrink-0 items-center whitespace-nowrap">
                        {[0, 1].map((copyIndex) => (
                          <div
                            key={copyIndex}
                            className="flex shrink-0 items-center gap-5 px-7 md:gap-7 md:px-10"
                          >
                            <span className="shrink-0 rounded-full border border-emerald-300/25 bg-emerald-300/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-emerald-200">
                              VISTA AL AIRE
                            </span>

                            {creatorOnAirOverlay.title ? (
                              <span className="shrink-0 text-sm font-black uppercase tracking-[0.08em] text-white">
                                {creatorOnAirOverlay.title}
                              </span>
                            ) : null}

                            {creatorOnAirOverlay.title &&
                            creatorOnAirOverlay.message ? (
                              <span className="text-cyan-300">
                                •
                              </span>
                            ) : null}

                            {creatorOnAirOverlay.message ? (
                              <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-white/70">
                                {creatorOnAirOverlay.message}
                              </span>
                            ) : null}

                            <span className="text-cyan-300">
                              •
                            </span>

                            <span className="shrink-0 text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                              VYRO LIVE
                            </span>

                            <span className="text-cyan-300">
                              •
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {creatorOnAirOverlay.cta ? (
                      <div className="flex shrink-0 items-center border-l border-white/10 px-4">
                        <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.12em] text-cyan-100">
                          {creatorOnAirOverlay.cta}
                        </span>
                      </div>
                    ) : null}

                    <div className="flex w-10 shrink-0 items-center justify-center border-l border-white/10">
                      <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.85)]" />
                    </div>
                  </div>
                </div>
              ) : null}

              <style>{`
                @keyframes vyro-creator-tv-ticker-motion {
                  from {
                    transform: translate3d(0, 0, 0);
                  }

                  to {
                    transform: translate3d(-50%, 0, 0);
                  }
                }

                .vyro-creator-tv-ticker-track {
                  animation:
                    vyro-creator-tv-ticker-motion
                    24s
                    linear
                    infinite;
                  will-change: transform;
                }

                @media (prefers-reduced-motion: reduce) {
                  .vyro-creator-tv-ticker-track {
                    animation: none;
                    transform: none;
                  }
                }
              `}</style>

              {isLive ? (
                <div className="absolute left-4 right-4 top-4 z-20">
                  <VyroCreatorControlStrip
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
                    messages={
                      dashboard.messages
                    }
                    gifts={
                      dashboard.gifts
                    }
                    duration={
                      formatDuration(
                        liveDuration,
                      )
                    }
                  />
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
                  {screenShareEnabled ? "Detener pantalla" : "Compartir pantalla"}
                </span>
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setSettingsOpen(
                      (current) => !current,
                    );
                  }}
                  className="w-full rounded-2xl border border-white/10 bg-[#111827] p-4 transition hover:border-cyan-400"
                >
                  <Settings className="mx-auto text-cyan-400" />

                  <span className="mt-2 block text-sm font-semibold">
                    Ajustes
                  </span>
                </button>

                {settingsOpen ? (
                  <div className="absolute bottom-full right-0 z-50 mb-3 w-[360px] rounded-3xl border border-cyan-500/30 bg-[#0B1220] p-5 text-left shadow-2xl">
                    <h3 className="font-black text-white">
                      Dispositivos VYRO LIVE
                    </h3>

                    <p className="mt-1 text-xs text-gray-400">
                      Controla qué cámara y micrófono usa tu Studio.
                    </p>

                    <label className="mt-5 block">
                      <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-cyan-400">
                        Cámara
                      </span>

                      <select
                        value={selectedCameraId}
                        onChange={(event) => {
                          setSelectedCameraId(
                            event.target.value,
                          );
                        }}
                        className="w-full rounded-xl border border-white/10 bg-black px-3 py-3 text-sm text-white outline-none focus:border-cyan-400"
                      >
                        {availableCameras.map(
                          (device, index) => (
                            <option
                              key={device.deviceId}
                              value={device.deviceId}
                            >
                              {device.label ||
                                `Cámara ${index + 1}`}
                            </option>
                          ),
                        )}
                      </select>
                    </label>

                    <label className="mt-4 block">
                      <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-cyan-400">
                        Micrófono
                      </span>

                      <select
                        value={selectedMicrophoneId}
                        onChange={(event) => {
                          setSelectedMicrophoneId(
                            event.target.value,
                          );
                        }}
                        className="w-full rounded-xl border border-white/10 bg-black px-3 py-3 text-sm text-white outline-none focus:border-cyan-400"
                      >
                        {availableMicrophones.map(
                          (device, index) => (
                            <option
                              key={device.deviceId}
                              value={device.deviceId}
                            >
                              {device.label ||
                                `Micrófono ${index + 1}`}
                            </option>
                          ),
                        )}
                      </select>
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        void startDevices(
                          selectedCameraId,
                          selectedMicrophoneId,
                        );

                        setSettingsOpen(false);
                      }}
                      className="mt-5 w-full rounded-xl bg-cyan-500 px-4 py-3 text-sm font-black text-black transition hover:bg-cyan-400"
                    >
                      Aplicar dispositivos
                    </button>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mx-auto mt-6 grid w-full gap-5 md:grid-cols-2">
<div className="min-w-0 rounded-3xl border border-cyan-500/20 bg-[#0B1220] p-6">
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

            <div className="min-w-0 rounded-3xl border border-cyan-500/20 bg-[#0B1220] p-6">
              <div className="flex items-center gap-3">
                <Users className="text-cyan-400" />
                <h2 className="text-xl font-bold">Invitados</h2>
              </div>

              <p className="mt-3 text-sm leading-6 text-gray-400">
                Invita participantes y administra sus permisos dentro de VYRO
                LIVE.
              </p>

              <LiveGuestControlCenter
                roomId={session?.id ?? null}
                disabled={!session}
              />
            </div>

            {isLive ? (
              <button
                type="button"
                onClick={stopLive}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white py-4 font-black text-black transition hover:bg-gray-200 md:col-span-2"
              >
                <Square size={20} fill="currentColor" />
                Finalizar VYRO LIVE
              </button>
            ) : (
              <button
                type="button"
                onClick={startLive}
                disabled={!devicesReady || !cameraEnabled}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-red-500 py-4 font-black text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50 md:col-span-2"
              >
                <Radio />
                Iniciar VYRO LIVE
              </button>
            )}
            </div>


          </section>

          <aside className="min-w-0 xl:sticky xl:top-6 xl:max-h-[calc(100vh-3rem)] xl:w-[420px] xl:justify-self-center xl:self-start xl:overflow-y-auto xl:overscroll-contain">
            <LiveProductionPanel
              room={liveKitRoom}
              isLive={isLive}
              onPublishedOverlayChange={
                setCreatorOnAirOverlay
              }
            />
          </aside>
        </div>

        <div className="mt-8 w-full">
          <BattleStudio
            disabled={
              !session ||
              battleInvitationsLoading ||
              creatingBattleSeries ||
              battleSeriesProcessing
            }
            onCreateSeries={(config) => {
              void handleCreateBattleSeries(
                config,
              );
            }}
          />
        </div>

        {activeBattleSeries ? (
          <section className="mt-10 overflow-hidden rounded-[2rem] border border-fuchsia-400/20 bg-[#07111D] text-white shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 p-6 md:p-8">
              <div>
                <div className="flex items-center gap-3 text-fuchsia-300">
                  <Trophy size={22} />

                  <p className="text-xs font-black uppercase tracking-[0.24em]">
                    VYRO Battle Series
                  </p>
                </div>

                <h2 className="mt-3 text-2xl font-black">
                  Estado de la serie
                </h2>
              </div>

              <div className="rounded-full border border-fuchsia-400/30 bg-fuchsia-400/10 px-4 py-2 text-sm font-black uppercase tracking-[0.14em] text-fuchsia-200">
                {activeBattleSeries.status}
              </div>
            </div>

            <div className="grid gap-4 p-6 md:grid-cols-3 md:p-8">
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <div className="flex items-center gap-3 text-cyan-300">
                  <Swords size={20} />

                  <p className="text-xs font-black uppercase tracking-[0.18em]">
                    Ronda
                  </p>
                </div>

                <p className="mt-4 text-3xl font-black">
                  {activeBattleSeries.currentPosition}
                  <span className="text-white/35">
                    /{activeBattleSeries.config.totalBattles}
                  </span>
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <div className="flex items-center gap-3 text-violet-300">
                  <Clock3 size={20} />

                  <p className="text-xs font-black uppercase tracking-[0.18em]">
                    Countdown
                  </p>
                </div>

                <p
                  aria-live="polite"
                  className="mt-4 text-3xl font-black tabular-nums"
                >
                  {battleCountdownPhase === "idle"
                    ? "--:--"
                    : battleSeriesCountdown.label}
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                  Batalla actual
                </p>

                <p className="mt-4 text-xl font-black">
                  {activeBattle?.status ??
                    "Esperando"}
                </p>

                <p className="mt-2 truncate text-xs text-white/35">
                  {activeBattle?.id ??
                    "Sin batalla asignada"}
                </p>
              </div>
            </div>

            <div className="border-t border-white/10 px-6 py-5 md:px-8">
              <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-white/60">
                {battleSeriesProcessing ? (
                  <>
                    <LoaderCircle
                      size={18}
                      className="animate-spin text-fuchsia-300"
                    />

                    <span>
                      Procesando cambio de ronda...
                    </span>
                  </>
                ) : battleCountdownPhase ===
                  "intermission" ? (
                  <span>
                    Intermedio activo. La siguiente ronda comenzará automáticamente.
                  </span>
                ) : battleCountdownPhase ===
                  "active" ? (
                  <span>
                    Battle activa y sincronizada en tiempo real.
                  </span>
                ) : activeBattleSeries.status ===
                  "finished" ? (
                  <span>
                    Battle Series finalizada.
                  </span>
                ) : (
                  <span>
                    Battle Series preparada.
                  </span>
                )}
              </div>
            </div>
          </section>
        ) : null}



        <div className="mt-8">
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

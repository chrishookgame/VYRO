"use client";
import {
  resolveVisualCoordination,
} from "@/components/live/visualcoordination/VisualCoordinationPolicy";

import {
  VYRO_LIVE_VISUAL_LAYER,
} from "@/components/live/visualcoordination/GlobalVisualLayerPolicy";

import {
  bridgeCompetitivePresentationEvents,
  createWinLeaderPresentation,
} from "@/components/live/competitiveorchestrator/bridge/CompetitivePresentationBridge";


import WorldVyroKing from "@/components/live/worldtitles/WorldVyroKing";
import WorldTitleDefense from "@/components/live/worldtitles/WorldTitleDefense";
import WorldTitleHistory from "@/components/live/worldtitles/WorldTitleHistory";

import VyroWorldCup from "@/components/live/worldcup/VyroWorldCup";

import VyroLiveCelebration from "@/components/live/celebrations/VyroLiveCelebration";

import { CompetitiveOverlay } from "@/components/live/competitivevisuals/overlay/CompetitiveOverlay";
import { MVPCelebration } from "@/components/live/competitivevisuals/mvp/MVPCelebration";
import { WinStreakOverlay } from "@/components/live/competitivevisuals/streak/WinStreakOverlay";
import { TopRankCelebration } from "@/components/live/competitivevisuals/toprank/TopRankCelebration";
import { ChampionCelebration } from "@/components/live/competitivevisuals/champion/ChampionCelebration";
import { WorldChampionCelebration } from "@/components/live/competitivevisuals/worldchampion/WorldChampionCelebration";
import { CompetitiveSpotlightOverlay } from "@/components/live/competitivevisuals/spotlight/CompetitiveSpotlightOverlay";
import { CompetitiveBanner } from "@/components/live/competitivevisuals/banner/CompetitiveBanner";

import type { ComponentType } from "react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Activity,
  ArrowLeft,
  CalendarClock,
  Eye,
  Gift,
  LoaderCircle,
  Radio,
  ShieldCheck,
  Trophy,
  UserRound,
  Users,
  Zap,
} from "lucide-react";

import {
  BattleAIDirector,
  BattleAnalytics,
  BattleCelebrationFX,
  BattleHighlights,
  BattleHistory,
  BattleMVP,
  BattleQueue,
  BattleReplay,
  BattleRecap,
  BattleRankingEvolution,
  NextChallenger,
  VyroTitlePanel,
  VyroHallOfFame,
  BattleStory,
  BattleShareCard,
  BattleRoundTransition,
  BattleSeriesScoreboard,
  BattleTimeline,
  BattleVSOverlay,
  BattleWinnerOverlay,
  LiveBattleEngine,
} from "@/components/live/battle";
import { LiveChatPanel } from "@/components/live/chat";
import { LiveLeaderboardPanel } from "@/components/live/leaderboard";
import { LiveRankingPanel } from "@/components/live/ranking";
import {
  GiftOverlay,
  GiftPicker,
} from "@/components/live/gifts";
import {
  useBattleAIDirector,
  useBattleAnalytics,
  useBattleCelebrationFX,
  useBattleHighlights,
  useBattleHistory,
  useBattleMVP,
  useBattleReplay,
  useBattleRecap,
  useBattleRankingEvolution,
  useNextChallenger,
  useVyroTitles,
  useVyroHallOfFame,
  useVyroWorldCup,
  useWorldVyroKing,
  useVyroLiveCelebrations,
  useBattleStory,
  useBattleShareCards,
  useBattleSeriesPresentation,
  useBattleTimeline,
  useLiveBattle,
  useLiveBattleSeries,
  useLiveChat,
  useLiveGiftOverlay,
  useLiveLeaderboard,
  useLivePresence,
  useLiveRealtime,
} from "@/hooks";
import {
  getLiveRoomDetails,
  type LiveRoomDetails,
} from "@/lib/live";

import { useCompetitiveOrchestrator } from "@/hooks/useCompetitiveOrchestrator";
import { useCompetitiveVisuals } from "@/hooks/useCompetitiveVisuals";
import { usePresentationDirector } from "@/hooks/usePresentationDirector";
import { usePresentationTimeline } from "@/hooks/usePresentationTimeline";
import { usePresentationTransition } from "@/hooks/usePresentationTransition";
import { usePresentationCinematics } from "@/hooks/usePresentationCinematics";
import UniverseLiveOverlay from "@/components/live/universe/visual/UniverseLiveOverlay";
import {
  LiveOrchestratorOverlay,
} from "@/components/live/orchestrator/visual";
import { useGiftComboEngine } from "@/hooks/useGiftComboEngine";
import { useGiftComboDirector } from "@/hooks/useGiftComboDirector";
import { useGlobalCompetitiveEcosystem } from "@/hooks/useGlobalCompetitiveEcosystem";
import { useUniverseEngine } from "@/hooks/useUniverseEngine";
import { useAIPresentationRuntime } from "@/hooks/useAIPresentationRuntime";

import type {
  CompetitiveOrchestratorPlayer,
} from "@/components/live/competitiveorchestrator/types/CompetitiveOrchestratorTypes";

import type { PresentationEvent } from "@/components/live/presentationdirector/types/PresentationEvent";

export default function LiveWatchPage() {
  const params = useParams<{ roomId: string }>();
  const roomId = params.roomId;

  const [room, setRoom] =
    useState<LiveRoomDetails | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const {
    connected,
    lastUpdate,
    counterVersion,
    reactionVersion,
    giftVersion,
    rankingVersion,
    eventVersion,
  } = useLiveRealtime(roomId);

  const {
    battle: liveBattle,
    loading: battleLoading,
    error: battleError,
  } = useLiveBattle(
    roomId,
    lastUpdate,
  );

  const globalCompetitiveEcosystem =
    useGlobalCompetitiveEcosystem({
      battleActive:
        liveBattle !== null,

      seasonActive:
        false,

      leagueActive:
        false,

      tournamentActive:
        false,

      worldCircuitActive:
        false,

      worldLeagueActive:
        false,

      raidActive:
        false,

      guildWarActive:
        false,

      allianceWarActive:
        false,
    });

  const {
    series: liveBattleSeries,
    loading: battleSeriesLoading,
    error: battleSeriesError,
  } = useLiveBattleSeries(roomId);

  const presentation =
    useBattleSeriesPresentation({
      series:
        liveBattleSeries,
      battle:
        liveBattle,
    });

  const {
    celebrationFX:
      battleCelebrationFX,
  } = useBattleCelebrationFX({
    visible:
      presentation.showWinnerOverlay,
    winnerName:
      presentation.winnerName,
    isSeriesWinner:
      presentation.isSeriesWinner,
  });

  const {
    events:
      battleTimelineEvents,
  } = useBattleTimeline({
    series:
      liveBattleSeries,
    battle:
      liveBattle,
  });

  const {
    highlights:
      battleHighlights,
  } = useBattleHighlights({
    events:
      battleTimelineEvents,
    limit:
      8,
  });

  const {
    moments:
      battleReplayMoments,
    activeMomentId:
      activeBattleReplayMomentId,
    playReplay:
      playBattleReplay,
    stopReplay:
      stopBattleReplay,
  } = useBattleReplay({
    events:
      battleTimelineEvents,
    limit:
      10,
  });

  const {
    analytics:
      battleAnalytics,
  } = useBattleAnalytics({
    series:
      liveBattleSeries,
    events:
      battleTimelineEvents,
  });

  const {
    director:
      battleAIDirector,
  } = useBattleAIDirector({
    analytics:
      battleAnalytics,
    phase:
      presentation.phase,
    winnerName:
      presentation.winnerName,
    isSeriesWinner:
      presentation.isSeriesWinner,
  });

  const {
    result:
      battleMVP,
  } = useBattleMVP({
    analytics:
      battleAnalytics,
    highlights:
      battleHighlights,
    leftCreatorId:
      liveBattle?.left.creatorId ??
      null,
    leftCreatorName:
      liveBattle?.left.creatorName ??
      null,
    rightCreatorId:
      liveBattle?.right.creatorId ??
      null,
    rightCreatorName:
      liveBattle?.right.creatorName ??
      null,
  });

  const {
    recap:
      battleRecap,
  } = useBattleRecap({
    analytics:
      battleAnalytics,
    director:
      battleAIDirector,
    highlights:
      battleHighlights,
    timeline:
      battleTimelineEvents,
    leftCreatorName:
      liveBattle?.left.creatorName ??
      null,
    rightCreatorName:
      liveBattle?.right.creatorName ??
      null,
    winnerName:
      presentation.winnerName,
  });

  const {
    story:
      battleStory,
  } = useBattleStory({
    analytics:
      battleAnalytics,
    director:
      battleAIDirector,
    recap:
      battleRecap,
    mvp:
      battleMVP,
  });

  const {
    shareCard:
      battleShareCard,
  } = useBattleShareCards({
    recap:
      battleRecap,
    story:
      battleStory,
    mvp:
      battleMVP,
  });

  const {
    entries:
      battleHistoryEntries,
  } = useBattleHistory({
    analytics:
      battleAnalytics,
    director:
      battleAIDirector,
    recap:
      battleRecap,
    story:
      battleStory,
    mvp:
      battleMVP,
  });

  const {
    data:
      battleRankingEvolution,
  } = useBattleRankingEvolution({
    analytics:
      battleAnalytics,
    director:
      battleAIDirector,
    leftCreatorId:
      liveBattle?.left.creatorId ??
      null,
    leftCreatorName:
      liveBattle?.left.creatorName ??
      null,
    rightCreatorId:
      liveBattle?.right.creatorId ??
      null,
    rightCreatorName:
      liveBattle?.right.creatorName ??
      null,
  });

  const competitivePlayers =
    useMemo<
      CompetitiveOrchestratorPlayer[]
    >(() => {
      const creators = [
        battleRankingEvolution.left,
        battleRankingEvolution.right,
      ];

      return creators.flatMap(
        (creator) => {
          if (!creator) {
            return [];
          }

          return [
            {
              creatorId:
                creator.creatorId,

              creatorName:
                creator.creatorName,

              rank:
                creator.rank,

              previousRank:
                creator.previousRank,

              wins:
                creator.wins,

              streak:
                creator.streak,

              championships:
                0,

              qualified:
                false,

              competitivePower:
                creator.score,
            },
          ];
        },
      );
    }, [
      battleRankingEvolution.left,
      battleRankingEvolution.right,
    ]);

  const competitiveEventClock =
    rankingVersion +
    eventVersion +
    battleTimelineEvents.length;

  const competitiveTopRankPlayer =
    [...competitivePlayers]
      .sort(
        (a,b) =>
          a.rank -
          b.rank,
      )[0] ?? null;

  const competitiveOrchestrator =
    useCompetitiveOrchestrator(
      competitivePlayers,
      competitiveEventClock,
    );

  const competitiveVisuals =
    useCompetitiveVisuals({
      events:
        competitiveOrchestrator
          .orchestratorEvents,

      hype:
        battleAIDirector.intensity,
    });

  const competitivePresentationEvents =
    useMemo(
      () => {
        const events =
          bridgeCompetitivePresentationEvents(
            competitiveOrchestrator
              .orchestratorEvents,
          );

        const winLeaderEvent =
          createWinLeaderPresentation(
            competitivePlayers,
            competitiveEventClock,
          );

        return winLeaderEvent
          ? [
              ...events,
              winLeaderEvent,
            ]
          : events;
      },
      [
        competitiveEventClock,
        competitiveOrchestrator
          .orchestratorEvents,
        competitivePlayers,
      ],
    );

  const presentationEvents =
    useMemo<
      PresentationEvent[]
    >(() => {
      const events:
        PresentationEvent[] =
          [
            ...competitivePresentationEvents,
          ];

      if(
        battleMVP.winner &&
        presentation.showWinnerOverlay
      ){
        events.push({
          id:
            `mvp-${battleMVP.winner.creatorId}-${competitiveEventClock}`,

          type:
            "MVP",

          creatorId:
            battleMVP.winner.creatorId,

          creatorName:
            battleMVP.winner.creatorName,

          score:
            battleMVP.winner.score,

          title:
            "VYRO LIVE MVP",

          message:
            `${battleMVP.winner.creatorName} domina el MVP Score.`,

          createdAt:
            competitiveEventClock,

          durationMs:
            4000,
        });
      }

      return events;
    }, [
      battleMVP.winner,
      competitivePresentationEvents,
      competitiveEventClock,
      presentation.showWinnerOverlay,
    ]);


  const {
    state:
      vyroTitles,
  } = useVyroTitles({
    ranking:
      battleRankingEvolution,
    countryCode:
      "CL",
    countryName:
      "Chile",
  });

  const {
    state:
      vyroLiveCelebrations,

    dismissActive:
      dismissVyroLiveCelebration,
  } = useVyroLiveCelebrations({
    ranking:
      battleRankingEvolution,
    titles:
      vyroTitles,
  });

  const {
    data:
      nextChallenger,
  } = useNextChallenger({
    ranking:
      battleRankingEvolution,
    titles:
      vyroTitles,
    countryCode:
      "CL",
  });

  const {
    data:
      vyroHallOfFame,
  } = useVyroHallOfFame({
    ranking:
      battleRankingEvolution,
    titles:
      vyroTitles,
    countryCode:
      "CL",
    countryName:
      "Chile",
  });

  const {
    data:
      vyroWorldCup,
  } = useVyroWorldCup({
    ranking:
      battleRankingEvolution,
    titles:
      vyroTitles,
    countryCode:
      "CL",
    countryName:
      "Chile",
  });

  const {
    state:
      worldVyroKing,
    history:
      worldTitleHistory,
  } = useWorldVyroKing({
    worldCup:
      vyroWorldCup,
    nextChallenger:
      nextChallenger,
  });

  const {
    activeGift,
    queuedGifts,
  } = useLiveGiftOverlay(lastUpdate);

  const {
    engineState:
      universeComboEngineState,
  } = useGiftComboEngine(
    activeGift,
  );

  const giftComboDirector =
    useGiftComboDirector(
      universeComboEngineState,
    );

  const universeEngine =
    useUniverseEngine({
      globalEvents:
        giftComboDirector.globalEvents,

      hypeScore:
        Math.max(
          giftComboDirector.hype.score,
          globalCompetitiveEcosystem.intensity,
        ),

      creatorName:
        competitiveTopRankPlayer
          ?.creatorName,

      creatorRank:
        competitiveTopRankPlayer
          ?.rank,

      creatorScore:
        competitiveTopRankPlayer
          ?.competitivePower,

      legendaryMoment:
        giftComboDirector
          .legendaryMoment,
    });
  const aiPresentationRuntime =
    useAIPresentationRuntime({
      director:
        universeEngine
          .directorAI
          .eventDirector,

      storyline:
        universeEngine
          .directorAI
          .storyline,

      creatorId:
        competitiveTopRankPlayer
          ?.creatorId,

      creatorName:
        competitiveTopRankPlayer
          ?.creatorName,

      creatorRank:
        competitiveTopRankPlayer
          ?.rank,

      creatorScore:
        competitiveTopRankPlayer
          ?.competitivePower,
      creatorChampionships:
        competitiveTopRankPlayer
          ?.championships,

      creatorCompetitivePower:
        competitiveTopRankPlayer
          ?.competitivePower,
      cooldownMs:
        Math.max(
          5000,
          universeEngine
            .orchestrator
            .scheduler
            .cooldownMs * 3,
        ),
    });

  const aiPresentationEvent =
    useMemo<
      PresentationEvent | null
    >(
      () =>
        aiPresentationRuntime.event
          ? {
              ...aiPresentationRuntime.event,

              priorityBoost:
                aiPresentationRuntime
                  .priorityBoost,

              allowPreemption:
                aiPresentationRuntime
                  .allowPreemption,
            }
          : null,
      [
        aiPresentationRuntime
          .allowPreemption,

        aiPresentationRuntime
          .event,

        aiPresentationRuntime
          .priorityBoost,
      ],
    );

  const orchestratedPresentationEvents =
    useMemo<
      PresentationEvent[]
    >(
      () =>
        aiPresentationEvent
          ? [
              ...presentationEvents,
              aiPresentationEvent,
            ]
          : presentationEvents,
      [
        aiPresentationEvent,
        presentationEvents,
      ],
    );

  const presentationDirector =
    usePresentationDirector(
      orchestratedPresentationEvents,
    );

  const presentationTimeline =
    usePresentationTimeline(
      presentationDirector.queue,
    );

  const presentationTransition =
    usePresentationTransition(
      presentationTimeline.activeEvent,
    );

  const presentationCinematics =
    usePresentationCinematics(
      presentationTimeline.activeEvent,
    );

  const visualCoordination =
    resolveVisualCoordination({
      presentationEvent:
        presentationTimeline.activeEvent,

      celebrationEvent:
        vyroLiveCelebrations.active,
    });

  const coordinatedCelebrationEvent =
    visualCoordination.showCelebration
      ? vyroLiveCelebrations.active
      : null;

  const aiPresentationIsActive =
    Boolean(
      aiPresentationEvent &&
      presentationTimeline.activeEvent?.id ===
        aiPresentationEvent.id,
    );

  const adaptiveCinematicScale =
    aiPresentationIsActive
      ? aiPresentationRuntime.cinematicScale
      : 1;

  const adaptiveOverlayStrength =
    aiPresentationIsActive
      ? aiPresentationRuntime.overlayStrength
      : 1;

  const adaptiveBackdropOpacity =
    Math.min(
      0.9,
      presentationCinematics
        .cinematic
        .backdropOpacity *
        adaptiveOverlayStrength,
    );

  const adaptiveBlurPx =
    presentationCinematics
      .cinematic
      .blurPx *
    adaptiveOverlayStrength;

  const {
    entries: leaderboardEntries,
    totalParticipants: leaderboardParticipants,
    registerGiftEvent,
  } = useLiveLeaderboard(
    roomId,
    10,
  );

  useEffect(() => {
    if (!activeGift) {
      return;
    }

    registerGiftEvent({
      id: activeGift.id,
      roomId,
      senderId:
        activeGift.senderId ??
        "anonymous",
      senderName: null,
      senderAvatarUrl: null,
      giftCode: activeGift.code,
      giftName: activeGift.name,
      amount: activeGift.amount,
      energy: activeGift.energyAdded,
      createdAt: Date.now(),
    });
  }, [
    activeGift,
    registerGiftEvent,
    roomId,
  ]);
  const {
    joined: presenceJoined,
    loading: presenceLoading,
    error: presenceError,
    counters: presenceCounters,
  } = useLivePresence(roomId);

  const {
    messages,
    loading: chatLoading,
    sending: chatSending,
    connected: chatConnected,
    error: chatError,
    sendMessage,
  } = useLiveChat(roomId);

  const loadRoom = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const roomDetails =
        await getLiveRoomDetails(roomId);

      setRoom(roomDetails);
    } catch (roomError) {
      setError(
        roomError instanceof Error
          ? roomError.message
          : "No se pudo cargar la sala LIVE.",
      );
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    void loadRoom();
  }, [loadRoom]);

  useEffect(() => {
    if (counterVersion > 0) {
      void loadRoom();
    }
  }, [counterVersion, loadRoom]);

  if (loading && !room) {
    return (
    <main className="flex min-h-screen items-center justify-center bg-[#05070A] text-white">
        <div className="text-center">
          <LoaderCircle
            size={42}
            className="mx-auto animate-spin text-cyan-400"
          />

          <p className="mt-4 text-gray-400">
            Cargando sala VYRO LIVE...
          </p>
        </div>
      </main>
    );
  }

  if ((error || presenceError) && !room) {
    return (
    <main className="flex min-h-screen items-center justify-center bg-[#05070A] px-6 text-white">
        <section className="max-w-xl rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-center">
          <h1 className="text-2xl font-black">
            No se pudo abrir esta sala
          </h1>

          <p className="mt-4 text-red-200">
            {error || presenceError}
          </p>

          <Link
            href="/live"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-bold text-black"
          >
            <ArrowLeft size={18} />
            Volver a VYRO LIVE
          </Link>
        </section>
      </main>
    );
  }

  if (!room) {
    return (
    <main className="flex min-h-screen items-center justify-center bg-[#05070A] px-6 text-white">
        <section className="max-w-xl rounded-3xl border border-white/10 bg-[#0B1220] p-8 text-center">
          <h1 className="text-2xl font-black">
            Esta sala LIVE no existe
          </h1>

          <p className="mt-4 text-gray-400">
            El enlace puede ser incorrecto o la sala fue eliminada.
          </p>

          <Link
            href="/live"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 font-bold text-black"
          >
            <ArrowLeft size={18} />
            Volver a VYRO LIVE
          </Link>
        </section>
      </main>
    );
  }

  const hostName =
    room.host?.fullName ||
    room.host?.username ||
    "Creador VYRO";

  const presentationDirectorOwnsChampionMoment =
    presentation.isSeriesWinner &&
    presentationTransition.visible &&
    (
      presentationTransition.event?.type ===
        "CHAMPION" ||
      presentationTransition.event?.type ===
        "WORLD_CHAMPION"
    );

  const showBattleWinnerPresentation =
    presentation.showWinnerOverlay &&
    !presentationDirectorOwnsChampionMoment;

  return (
    <>
      <div
        aria-hidden={
          !visualCoordination.showGiftOverlay
        }
        style={{
          display:
            visualCoordination.showGiftOverlay
              ? "contents"
              : "none",
        }}
      >
        <GiftOverlay
          gift={activeGift}
          queuedGifts={queuedGifts}
        />
      </div>

      {visualCoordination.showUniverseOverlay ? (
        <UniverseLiveOverlay
          state={
            universeEngine
          }
        />
      ) : null}

      {visualCoordination.showOrchestratorOverlay ? (
        <LiveOrchestratorOverlay
          state={
            universeEngine
          }
        />
      ) : null}

      <CompetitiveOverlay
        event={
          competitiveVisuals.primaryEvent
        }
      />

      <div
        data-vyro-presentation-transition="true"
        style={{
          position:"absolute",
          inset:0,
          pointerEvents:"none",
          opacity:
            presentationTransition
              .animationStyle.opacity,
          transform:
            `translateY(${presentationTransition.animationStyle.translateY}px) scale(${presentationTransition.animationStyle.scale * adaptiveCinematicScale})`,
          transition:
            presentationTransition.transition,
          zIndex:VYRO_LIVE_VISUAL_LAYER.presentationSurface,
          backdropFilter:
            `blur(${adaptiveBlurPx}px)`,
          background:
            adaptiveBackdropOpacity > 0
              ? `rgba(0,0,0,${adaptiveBackdropOpacity})`
              : "transparent",
        }}
      >
        <TopRankCelebration
        creatorName={
          presentationTransition.event?.creatorName ??
          ""
        }
        rank={
          presentationTransition.event?.rank ??
          0
        }
        visible={
          presentationTransition.visible &&
          presentationTransition.event?.type ===
          "TOP_RANK"
        }
      />

      <WinStreakOverlay
        creatorName={
          presentationTransition.event?.creatorName ??
          ""
        }
        streak={
          presentationTransition.event?.streak ??
          0
        }
        visible={
          presentationTransition.visible &&
          presentationTransition.event?.type ===
          "WIN_STREAK"
        }
      />

      <MVPCelebration
        creatorName={
          presentationTransition.event?.creatorName ??
          ""
        }
        score={
          presentationTransition.event?.score
        }
        visible={
          presentationTransition.visible &&
          presentationTransition.event?.type ===
          "MVP"
        }
      />

      <ChampionCelebration
        creatorName={
          presentationTransition.event?.creatorName ??
          ""
        }
        championships={
          presentationTransition.event?.championships ??
          0
        }
        visible={
          presentationTransition.visible &&
          presentationTransition.event?.type ===
          "CHAMPION"
        }
      />

      <WorldChampionCelebration
        creatorName={
          presentationTransition.event?.creatorName ??
          ""
        }
        title={
          presentationTransition.event?.title
        }
        message={
          presentationTransition.event?.message
        }
        visible={
          presentationTransition.visible &&
          presentationTransition.event?.type ===
          "WORLD_CHAMPION"
        }
      />

      <CompetitiveSpotlightOverlay
        creatorName={
          presentationTransition.event?.creatorName ??
          ""
        }
        rank={
          presentationTransition.event?.rank ??
          0
        }
        wins={
          presentationTransition.event?.wins
        }
        competitivePower={
          presentationTransition.event?.competitivePower ??
          0
        }
        visible={
          presentationTransition.visible &&
          presentationTransition.event?.type ===
          "SPOTLIGHT"
        }
      />

      <CompetitiveBanner
        title={
          presentationTransition.event?.title ??
          ""
        }
        subtitle={
          presentationTransition.event?.message
        }
        visible={
          presentationTransition.visible &&
          presentationTransition.event?.type ===
          "BANNER"
        }
      />

      </div>
      <BattleCelebrationFX
        state={{
          ...battleCelebrationFX,
          visible:
            battleCelebrationFX.visible &&
            showBattleWinnerPresentation,
        }}
      />

      <BattleWinnerOverlay
        visible={
          showBattleWinnerPresentation
        }
        winnerName={
          presentation.winnerName
        }
        isSeriesWinner={
          presentation.isSeriesWinner
        }
        durationMs={4000}
        onFinished={
          presentation.onWinnerFinished
        }
      />

      {liveBattleSeries &&
      liveBattle &&
      presentation.startsAt ? (
        <BattleVSOverlay
          visible={
            presentation.showVSOverlay
          }
          round={
            presentation.round
          }
          totalRounds={
            presentation.totalRounds
          }
          leftCreatorName={
            liveBattle.left.creatorName
          }
          rightCreatorName={
            liveBattle.right.creatorName
          }
          remainingSeconds={
            presentation.remainingSeconds
          }
          countdownLabel={
            presentation.countdownLabel
          }
        />
      ) : null}

      <main className="min-h-screen bg-[#05070A] px-6 py-8 text-white md:px-10">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/live"
            className="inline-flex items-center gap-2 font-semibold text-cyan-400 transition hover:text-cyan-300"
          >
            <ArrowLeft size={18} />
            Volver a VYRO LIVE
          </Link>

          <div
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold ${
              connected
                ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-300"
                : "border-yellow-400/30 bg-yellow-500/10 text-yellow-300"
            }`}
          >
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                connected
                  ? "animate-pulse bg-emerald-400"
                  : "bg-yellow-400"
              }`}
            />

            {connected && presenceJoined
              ? "Realtime y presencia conectados"
              : presenceLoading
                ? "Registrando presencia"
                : "Conectando Realtime"}
          </div>
        </div>

        <header className="mt-6 overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-[#0B1220] to-[#111827] p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Radio className="text-cyan-400" />

              <p className="font-bold uppercase tracking-[0.3em] text-cyan-400">
                VYRO LIVE ROOM
              </p>
            </div>

            <span className="rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-black uppercase text-red-300">
              {room.status}
            </span>
          </div>

          <h1 className="mt-5 text-4xl font-black md:text-5xl">
            {room.title}
          </h1>

          {room.description ? (
            <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-400">
              {room.description}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-300">
            <div className="inline-flex items-center gap-2">
              <UserRound
                size={18}
                className="text-cyan-400"
              />

              <span>{hostName}</span>

              {room.host?.verified ? (
                <ShieldCheck
                  size={18}
                  className="text-cyan-400"
                />
              ) : null}
            </div>

            <div className="inline-flex items-center gap-2">
              <CalendarClock
                size={18}
                className="text-cyan-400"
              />

              <span>
                {room.startedAt
                  ? new Intl.DateTimeFormat(
                      "es-419",
                      {
                        dateStyle: "medium",
                        timeStyle: "short",
                      },
                    ).format(
                      new Date(room.startedAt),
                    )
                  : "Transmisión aún no iniciada"}
              </span>
            </div>
          </div>
        </header>

        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <MetricCard
            title="Espectadores"
            value={
              presenceCounters?.activeViewers ??
              room.counters.activeViewers
            }
            icon={Eye}
          />

          <MetricCard
            title="Pico de audiencia"
            value={
              presenceCounters?.peakViewers ??
              room.counters.peakViewers
            }
            icon={Users}
          />

          <MetricCard
            title="Reacciones"
            value={room.counters.totalReactions}
            icon={Zap}
          />

          <MetricCard
            title="Regalos"
            value={room.counters.totalGifts}
            icon={Gift}
          />

          <MetricCard
            title="Entradas"
            value={
              presenceCounters?.totalJoins ??
              room.counters.totalJoins
            }
            icon={Activity}
          />
        </section>

        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <RealtimeCard
            title="Reacciones Realtime"
            value={reactionVersion}
            icon={Zap}
          />

          <RealtimeCard
            title="Regalos Realtime"
            value={giftVersion}
            icon={Gift}
          />

          <RealtimeCard
            title="Ranking Realtime"
            value={rankingVersion}
            icon={Trophy}
          />

          <RealtimeCard
            title="Eventos Realtime"
            value={eventVersion}
            icon={Activity}
          />
        </section>



        {battleLoading ? (
          <section className="mt-8 rounded-[2rem] border border-white/10 bg-[#07111D] p-8 text-center">
            <LoaderCircle className="mx-auto animate-spin text-fuchsia-400" />

            <p className="mt-4 text-sm text-white/50">
              Cargando batalla LIVE...
            </p>
          </section>
        ) : null}

        {!battleLoading && battleError ? (
          <section
            role="alert"
            className="mt-8 rounded-[2rem] border border-red-500/30 bg-red-500/10 p-6 text-red-200"
          >
            {battleError}
          </section>
        ) : null}

        {battleSeriesLoading ? (
          <section className="mt-8 rounded-[2rem] border border-white/10 bg-[#07111D] p-8 text-center">
            <LoaderCircle className="mx-auto animate-spin text-amber-300" />

            <p className="mt-4 text-sm text-white/50">
              Cargando Battle Series...
            </p>
          </section>
        ) : null}

        {!battleSeriesLoading && battleSeriesError ? (
          <section
            role="alert"
            className="mt-8 rounded-[2rem] border border-red-500/30 bg-red-500/10 p-6 text-red-200"
          >
            {battleSeriesError}
          </section>
        ) : null}

        {!battleSeriesLoading &&
        !battleSeriesError &&
        liveBattleSeries &&
        liveBattle ? (
          <>
            <section className="mt-8">
              <BattleSeriesScoreboard
                status={liveBattleSeries.status}
                currentPosition={
                  liveBattleSeries.currentPosition
                }
                totalBattles={
                  liveBattleSeries.config.totalBattles
                }
                leftCreatorId={
                  liveBattle.left.creatorId
                }
                rightCreatorId={
                  liveBattle.right.creatorId
                }
                leftCreatorName={
                  liveBattle.left.creatorName
                }
                rightCreatorName={
                  liveBattle.right.creatorName
                }
                leftWins={liveBattleSeries.leftWins}
                rightWins={liveBattleSeries.rightWins}
                draws={liveBattleSeries.draws}
                winnerId={liveBattleSeries.winnerId}
              />
            </section>

            {presentation.showRoundTransition &&
            presentation.startsAt ? (
              <section className="mt-8">
                <BattleRoundTransition
                  round={
                    presentation.round
                  }
                  totalRounds={
                    presentation.totalRounds
                  }
                  leftCreatorName={
                    liveBattle.left.creatorName
                  }
                  rightCreatorName={
                    liveBattle.right.creatorName
                  }
                  remainingSeconds={
                    presentation.remainingSeconds
                  }
                  countdownLabel={
                    presentation.countdownLabel
                  }
                />
              </section>
            ) : null}

            <section className="mt-8">
              <BattleTimeline
                events={
                  battleTimelineEvents
                }
              />
            </section>

            <section className="mt-8">
              <BattleHighlights
                highlights={
                  battleHighlights
                }
              />
            </section>

            <section className="mt-8">
              <BattleReplay
                moments={
                  battleReplayMoments
                }
                activeMomentId={
                  activeBattleReplayMomentId
                }
                onPlay={
                  playBattleReplay
                }
                onStop={
                  stopBattleReplay
                }
              />
            </section>

            <section className="mt-8">
              <BattleAnalytics
                analytics={
                  battleAnalytics
                }
              />
            </section>

            <section className="mt-8">
              <BattleAIDirector
                director={
                  battleAIDirector
                }
              />
            </section>

            <section className="mt-8">
              <BattleMVP
                result={
                  battleMVP
                }
              />
            </section>

            <section className="mt-8">
              <BattleRecap
                recap={
                  battleRecap
                }
              />
            </section>

            <section className="mt-8">
              <BattleStory
                story={
                  battleStory
                }
              />
            </section>

            <section className="mt-8">
              <BattleShareCard
                data={
                  battleShareCard
                }
              />
            </section>

            <section className="mt-8">
              <BattleHistory
                entries={
                  battleHistoryEntries
                }
              />
            </section>

            <section className="mt-8">
              <BattleRankingEvolution
                data={
                  battleRankingEvolution
                }
              />
            </section>

            <section className="mt-8">
              <VyroLiveCelebration
                event={
                  coordinatedCelebrationEvent
                }
                onComplete={() => {
                  if (
                    coordinatedCelebrationEvent
                  ) {
                    dismissVyroLiveCelebration(
                      coordinatedCelebrationEvent.id,
                    );
                  }
                }}
              />
            </section>

            <section className="mt-8">
              <NextChallenger
                data={
                  nextChallenger
                }
              />
            </section>

            <section className="mt-8">
              <VyroHallOfFame
                data={
                  vyroHallOfFame
                }
              />
            </section>

            <section className="mt-8">
              <VyroWorldCup
                data={
                  vyroWorldCup
                }
              />
            </section>

            <section className="mt-8">
              <WorldVyroKing
                state={
                  worldVyroKing
                }
              />
            </section>

            <section className="mt-8">
              <WorldTitleDefense
                defense={
                  worldVyroKing.latestDefense
                }
              />
            </section>

            <section className="mt-8">
              <WorldTitleHistory
                defenses={
                  worldTitleHistory
                }
              />
            </section>

            <section className="mt-8">
              <VyroTitlePanel
                state={
                  vyroTitles
                }
              />
            </section>

            <section className="mt-8">
              <BattleQueue
                rounds={liveBattleSeries.rounds}
                currentPosition={
                  liveBattleSeries.currentPosition
                }
                leftCreatorId={
                  liveBattle.left.creatorId
                }
                rightCreatorId={
                  liveBattle.right.creatorId
                }
                leftCreatorName={
                  liveBattle.left.creatorName
                }
                rightCreatorName={
                  liveBattle.right.creatorName
                }
              />
            </section>
          </>
        ) : null}

        {!battleLoading &&
        !battleError &&
        liveBattle &&
        presentation.showBattleEngine ? (
          <section className="mt-8">
            <LiveBattleEngine
              battle={liveBattle}
            />
          </section>
        ) : null}

        <section className="mt-8">
          <LiveLeaderboardPanel
            entries={leaderboardEntries}
            totalParticipants={
              leaderboardParticipants
            }
          />
        </section>

        <section className="mt-8">
          <LiveRankingPanel
            roomId={roomId}
            rankingVersion={rankingVersion}
          />
        </section>
        <section className="mt-8">
          <GiftPicker roomId={roomId} />
        </section>
        <section className="mt-8">
          <LiveChatPanel
            messages={messages}
            loading={chatLoading}
            sending={chatSending}
            connected={chatConnected}
            error={chatError}
            onSendMessage={sendMessage}
          />
        </section>
        <section className="mt-8 rounded-3xl border border-white/10 bg-[#0B1220] p-6">
          <h2 className="text-xl font-black">
            Actividad en tiempo real
          </h2>

          {lastUpdate ? (
            <div className="mt-4 rounded-2xl border border-cyan-500/20 bg-black/30 p-5">
              <p className="font-bold text-cyan-400">
                Tipo: {lastUpdate.type}
              </p>

              <pre className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap break-words text-xs text-gray-300">
                {JSON.stringify(
                  lastUpdate.payload,
                  null,
                  2,
                )}
              </pre>
            </div>
          ) : (
            <p className="mt-4 text-gray-400">
              Esperando la primera actividad de esta sala.
            </p>
          )}
        </section>
      </section>
      </main>
    </>
  );
}

interface CardProps {
  title: string;
  value: number;
  icon: ComponentType<{
    size?: number;
    className?: string;
  }>;
}

function MetricCard({
  title,
  value,
  icon: Icon,
}: CardProps) {
  return (
    <article className="rounded-3xl border border-cyan-500/20 bg-[#0B1220] p-5">
      <Icon
        size={26}
        className="text-cyan-400"
      />

      <p className="mt-4 text-sm font-semibold text-gray-400">
        {title}
      </p>

      <p className="mt-2 text-3xl font-black">
        {value}
      </p>
    </article>
  );
}

function RealtimeCard(
  props: CardProps,
) {
  return <MetricCard {...props} />;
}

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
  useRef,
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
  Share2,
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
import FollowButton from "@/components/feed/FollowButton";
import {
  LiveGuestMedia,
  LiveGuestStageOverlay,
  type LiveGuestMediaHandle,
} from "@/components/live/guest";
import { LiveGuestWaitingPreview } from "@/components/live/guest/LiveGuestWaitingPreview";
import { LiveGuestRequestButton } from "@/components/live/guest/LiveGuestRequestButton";
import { useLiveGuestInvitations } from "@/hooks/useLiveGuestInvitations";
import { LiveViewerMedia } from "@/components/live/media/LiveViewerMedia";
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
import { supabase } from "@/lib/supabase";
import {
  sendLiveReaction,
  type LiveReactionType,
} from "@/lib/live/reactions.repository";

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
import { createGlobalCompetitiveRuntime } from "@/components/live/ecosystem/GlobalCompetitiveRuntime";
import {
  createLiveRecognitionMoment,
  createLiveRecognitionSignals,
  resolvePrimaryLiveRecognitionMoment,
  useLiveRecognitionLifecycle,
} from "@/components/live/recognition";
import {
  competitiveOrchestratorPlayersToSeasonPlayers,
} from "@/components/live/ecosystem/adapters/CompetitiveRuntimeAdapters";
import { useVyroLeagues } from "@/hooks/useVyroLeagues";
import { useUniverseEngine } from "@/hooks/useUniverseEngine";
import { useAIPresentationRuntime } from "@/hooks/useAIPresentationRuntime";

import type {
  CompetitiveOrchestratorPlayer,
} from "@/components/live/competitiveorchestrator/types/CompetitiveOrchestratorTypes";

import type { PresentationEvent } from "@/components/live/presentationdirector/types/PresentationEvent";

export default function LiveWatchPage() {
  const params = useParams<{ roomId: string }>();
  const roomId = params.roomId;
  const {
    received: guestInvitations,
    loading: guestInvitationsLoading,
    acceptInvitation: acceptGuestInvitation,
    declineInvitation: declineGuestInvitation,
    leaveGuestStage: leaveActiveGuestStage,
  } = useLiveGuestInvitations();

  const [
    guestActionId,
    setGuestActionId,
  ] = useState<string | null>(null);

  const [
    guestActionError,
    setGuestActionError,
  ] = useState("");

  const activeGuestInvitation =
    useMemo(
      () =>
        guestInvitations.find(
          (invitation) =>
            invitation.roomId === roomId &&
            (
              invitation.status === "pending" ||
              invitation.status === "accepted"
            ),
        ) ?? null,
      [
        guestInvitations,
        roomId,
      ],
    );

  const isActiveGuest =
    activeGuestInvitation?.status ===
      "accepted";

  const isGuestOnStage =
    isActiveGuest &&
    activeGuestInvitation?.stageStatus ===
      "on_stage";

  const isGuestWaiting =
    isActiveGuest &&
    activeGuestInvitation?.stageStatus ===
      "waiting";

  async function handleAcceptGuest() {
    if (
      !activeGuestInvitation ||
      activeGuestInvitation.status !==
        "pending"
    ) {
      return;
    }

    setGuestActionId(
      activeGuestInvitation.id,
    );

    setGuestActionError("");

    try {
      await acceptGuestInvitation(
        activeGuestInvitation.id,
      );
    } catch (guestError) {
      setGuestActionError(
        guestError instanceof Error
          ? guestError.message
          : "No fue posible aceptar la invitación.",
      );
    } finally {
      setGuestActionId(null);
    }
  }

  async function handleDeclineGuest() {
    if (
      !activeGuestInvitation ||
      activeGuestInvitation.status !==
        "pending"
    ) {
      return;
    }

    setGuestActionId(
      activeGuestInvitation.id,
    );

    setGuestActionError("");

    try {
      await declineGuestInvitation(
        activeGuestInvitation.id,
      );
    } catch (guestError) {
      setGuestActionError(
        guestError instanceof Error
          ? guestError.message
          : "No fue posible rechazar la invitación.",
      );
    } finally {
      setGuestActionId(null);
    }
  }

  async function handleLeaveGuestStage() {
    if (
      !activeGuestInvitation ||
      activeGuestInvitation.status !==
        "accepted" ||
      activeGuestInvitation.stageStatus !==
        "on_stage"
    ) {
      return;
    }

    setGuestActionId(
      activeGuestInvitation.id,
    );

    setGuestActionError("");

    try {
      await leaveActiveGuestStage(
        activeGuestInvitation.id,
      );
    } catch (guestError) {
      setGuestActionError(
        guestError instanceof Error
          ? guestError.message
          : "No fue posible salir del Guest Stage.",
      );
    } finally {
      setGuestActionId(null);
    }
  }
  const [room, setRoom] =
    useState<LiveRoomDetails | null>(null);

  const [
    reactionPickerOpen,
    setReactionPickerOpen,
  ] = useState(false);

  const [viewerPanel, setViewerPanel] =
    useState<"chat" | "gifts" | null>(null);

  const [
    viewerAuthGateOpen,
    setViewerAuthGateOpen,
  ] = useState(false);

  const [
    viewerAuthAction,
    setViewerAuthAction,
  ] = useState<
    "reaction" | "chat" | "gifts" | "follow" | "guest" | null
  >(null);

  async function requireViewerAuth(
    action: "reaction" | "chat" | "gifts",
  ) {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      setViewerAuthAction(action);
      setViewerAuthGateOpen(true);

      return false;
    }

    return true;
  }

  const [
    sendingReaction,
    setSendingReaction,
  ] = useState<LiveReactionType | null>(
    null,
  );

  const [
    reactionError,
    setReactionError,
  ] = useState("");

  const [
    shareFeedback,
    setShareFeedback,
  ] = useState("");

  async function handleShareLive() {
    const shareUrl = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: room?.title ?? "VYRO LIVE",
          text: "Mira este LIVE en VYRO.",
          url: shareUrl,
        });

        return;
      }

      await navigator.clipboard.writeText(
        shareUrl,
      );

      setShareFeedback("Enlace copiado");

      window.setTimeout(() => {
        setShareFeedback("");
      }, 2200);
    } catch (shareError) {
      if (
        shareError instanceof DOMException &&
        shareError.name === "AbortError"
      ) {
        return;
      }

      console.error(
        "VYRO share LIVE error:",
        shareError,
      );

      setShareFeedback(
        "No se pudo compartir",
      );

      window.setTimeout(() => {
        setShareFeedback("");
      }, 2200);
    }
  }
  type LiveFloatingReaction = {
    id: string;
    emoji: string;
    x: number;
    drift: number;
    scale: number;
  };

  const displayedReactionIdsRef =
    useRef<Set<string>>(new Set());
  const guestMediaRef =
    useRef<LiveGuestMediaHandle | null>(null);


  const [
    floatingReactions,
    setFloatingReactions,
  ] = useState<LiveFloatingReaction[]>([]);

  const reactionOptions: Array<{
    type: LiveReactionType;
    emoji: string;
    label: string;
  }> = [
    {
      type: "like",
      emoji: "👍",
      label: "Me gusta",
    },
    {
      type: "love",
      emoji: "❤️",
      label: "Me encanta",
    },
    {
      type: "fire",
      emoji: "🔥",
      label: "Fuego",
    },
    {
      type: "wow",
      emoji: "😮",
      label: "Wow",
    },
    {
      type: "celebrate",
      emoji: "🎉",
      label: "Celebrar",
    },
    {
      type: "support",
      emoji: "👏",
      label: "Apoyar",
    },
    {
      type: "vyro_energy",
      emoji: "⚡",
      label: "VYRO Energy",
    },
  ];

  async function handleSendReaction(
    reactionType: LiveReactionType,
  ) {
    if (sendingReaction) {
      return;
    }

    setSendingReaction(
      reactionType,
    );

    setReactionError("");

    try {
      const reactionId =
        await sendLiveReaction({
          roomId,
          reactionType,
        });

      const localReaction =
        reactionOptions.find(
          (option) =>
            option.type === reactionType,
        );

      if (
        localReaction &&
        !displayedReactionIdsRef.current.has(
          reactionId,
        )
      ) {
        displayedReactionIdsRef.current.add(
          reactionId,
        );

        const visualReaction: LiveFloatingReaction = {
          id: reactionId,
          emoji: localReaction.emoji,
          x: 82,
          drift: -18,
          scale: 1.15,
        };

        setFloatingReactions((current) => [
          ...current.slice(-18),
          visualReaction,
        ]);

        window.setTimeout(() => {
          setFloatingReactions((current) =>
            current.filter(
              (item) =>
                item.id !== reactionId,
            ),
          );
        }, 2600);

        window.setTimeout(() => {
          displayedReactionIdsRef.current.delete(
            reactionId,
          );
        }, 10000);
      }

    } catch (sendError) {
      setReactionError(
        sendError instanceof Error
          ? sendError.message
          : "No se pudo enviar la reacción.",
      );
    } finally {
      setSendingReaction(null);
    }
  }

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const {
    connected,
    lastUpdate,
    lastReactionUpdate,
    counterVersion,
    reactionVersion,
    giftVersion,
    rankingVersion,
    eventVersion,
  } = useLiveRealtime(roomId);

  useEffect(() => {
    if (!lastReactionUpdate) {
      return;
    }

    const payload =
      lastReactionUpdate.payload as {
        new?: {
          id?: string;
          reaction_type?: LiveReactionType;
        };
      };

    const reactionType =
      payload.new?.reaction_type;

    const reactionId =
      payload.new?.id;

    if (
      !reactionType ||
      !reactionId
    ) {
      return;
    }

    if (
      displayedReactionIdsRef.current.has(
        reactionId,
      )
    ) {
      return;
    }

    displayedReactionIdsRef.current.add(
      reactionId,
    );

    const reactionEmojiByType: Record<
      LiveReactionType,
      string
    > = {
      like: "👍",
      love: "❤️",
      fire: "🔥",
      wow: "😮",
      celebrate: "🎉",
      support: "👏",
      vyro_energy: "⚡",
    };

    const reactionEmoji =
      reactionEmojiByType[reactionType];


    const visualId = reactionId;

    const visualSeed =
      visualId.split("").reduce(
        (seed, character) =>
          (
            seed * 31 +
            character.charCodeAt(0)
          ) % 100000,
        7,
      );

    const visualReaction: LiveFloatingReaction = {
      id: visualId,
      emoji: reactionEmoji,
      x:
        68 +
        (visualSeed % 2500) / 100,
      drift:
        -30 +
        ((visualSeed * 7) % 6000) / 100,
      scale:
        0.9 +
        ((visualSeed * 13) % 45) / 100,
    };

    setFloatingReactions((current) => [
      ...current.slice(-18),
      visualReaction,
    ]);

    const timeout = window.setTimeout(() => {
      setFloatingReactions((current) =>
        current.filter(
          (item) =>
            item.id !== visualId,
        ),
      );
    }, 2600);

    window.setTimeout(() => {
      displayedReactionIdsRef.current.delete(
        visualId,
      );
    }, 10000);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [lastReactionUpdate]);

  const {
    battle: liveBattle,
    loading: battleLoading,
    error: battleError,
  } = useLiveBattle(
    roomId,
    lastUpdate,
  );


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

  const seasonPlayers =
    competitiveOrchestratorPlayersToSeasonPlayers(
      competitivePlayers,
    );

  const competitiveSeasonActive =
    seasonPlayers.length > 0;


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
    state:
      vyroLeagueState,
  } = useVyroLeagues({
    nextChallenger,
  });

  const realLeagueActive =
    vyroLeagueState.player !== null;

  const globalCompetitiveRuntime =
    createGlobalCompetitiveRuntime({
      battleActive:
        liveBattle !== null,

      season: {
        active:
          competitiveSeasonActive,
      },

      leagueActive:
        realLeagueActive,
    });

  const {
    ecosystem: globalCompetitiveEcosystem,
  } = globalCompetitiveRuntime;

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

  const recognitionCreatorId =
    liveBattle?.winnerId ??
    liveBattle?.left.creatorId ??
    roomId;

  const recognitionCreatorName =
    presentation.winnerName ??
    (
      liveBattle?.winnerId ===
      liveBattle?.right.creatorId
        ? liveBattle?.right.creatorName
        : liveBattle?.left.creatorName
    ) ??
    "VYRO Creator";

  const recognitionHypeScore =
    Math.max(
      giftComboDirector.hype.score,
      globalCompetitiveEcosystem.intensity,
    );

  const recognitionBundle =
    createLiveRecognitionSignals({
      creatorId:
        recognitionCreatorId,

      creatorName:
        recognitionCreatorName,

      winStreak:
        presentationTransition.event?.streak ??
        undefined,

      battleWinner:
        Boolean(
          liveBattle?.winnerId,
        ),

      champion:
        presentationTransition.event?.type ===
          "CHAMPION" ||
        presentationTransition.event?.type ===
          "WORLD_CHAMPION",

      hypeScore:
        recognitionHypeScore,

      competitiveIntensity:
        globalCompetitiveEcosystem.intensity,
    });

  const recognitionMoments =
    recognitionBundle.signals.map(
      (signal) =>
        createLiveRecognitionMoment(
          signal,
          recognitionBundle.context,
        ),
    );

  const primaryRecognitionMoment =
    resolvePrimaryLiveRecognitionMoment(
      recognitionMoments,
    );

  const recognitionBannerMoment =
    primaryRecognitionMoment?.kind ===
      "HYPE"
      ? primaryRecognitionMoment
      : null;

  const activeRecognitionBannerMoment =
    useLiveRecognitionLifecycle(
      recognitionBannerMoment,
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

  const showRecognitionBanner =
    activeRecognitionBannerMoment !== null &&
    !presentationTransition.visible &&
    visualCoordination.showCelebration;

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
            Conectando con VYRO LIVE...
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
            No se pudo abrir este LIVE
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
            Este LIVE no existe
          </h1>

          <p className="mt-4 text-gray-400">
            El enlace puede ser incorrecto o este LIVE ya no está disponible.
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
      <CompetitiveBanner
        title={
          activeRecognitionBannerMoment?.title ??
          ""
        }
        subtitle={
          activeRecognitionBannerMoment?.message
        }
        visible={
          showRecognitionBanner
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

            {connected
              ? presenceJoined
                ? "Realtime y presencia conectados"
                : "Realtime conectado"
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
                VYRO LIVE
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
              <FollowButton
                creatorId={room.hostId}
                ownLabel={null}
                onAuthRequired={() => {
                  setViewerAuthAction("follow");
                  setViewerAuthGateOpen(true);
                }}
              />
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

        <section className="relative mt-8">
          {activeGuestInvitation?.status ===
          "pending" ? (
            <div className="mb-5 overflow-hidden rounded-[2rem] border border-cyan-400/25 bg-gradient-to-br from-cyan-500/10 via-[#08111C] to-black p-6 shadow-2xl">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
                    Invitación VYRO LIVE
                  </p>

                  <h2 className="mt-2 text-2xl font-black text-white">
                    El creador te invitó al LIVE
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
                    Puedes entrar como participante con los permisos multimedia autorizados.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {activeGuestInvitation
                      .permissions
                      .canPublishCamera ? (
                      <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-bold text-white/70">
                        Cámara
                      </span>
                    ) : null}

                    {activeGuestInvitation
                      .permissions
                      .canPublishMicrophone ? (
                      <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-bold text-white/70">
                        Micrófono
                      </span>
                    ) : null}

                    {activeGuestInvitation
                      .permissions
                      .canShareScreen ? (
                      <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-bold text-white/70">
                        Compartir pantalla
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={
                      guestActionId ===
                      activeGuestInvitation.id
                    }
                    onClick={() => {
                      void handleDeclineGuest();
                    }}
                    className="rounded-xl border border-white/15 bg-white/[0.04] px-5 py-3 font-black text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Rechazar
                  </button>

                  <button
                    type="button"
                    disabled={
                      guestActionId ===
                      activeGuestInvitation.id
                    }
                    onClick={() => {
                      void handleAcceptGuest();
                    }}
                    className="rounded-xl bg-cyan-400 px-6 py-3 font-black text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {guestActionId ===
                    activeGuestInvitation.id
                      ? "Entrando..."
                      : "Aceptar y entrar"}
                  </button>
                </div>
              </div>

              {guestActionError ? (
                <p className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
                  {guestActionError}
                </p>
              ) : null}
            </div>
          ) : null}

          {guestInvitationsLoading &&
          !activeGuestInvitation ? (
            <div className="mb-4 flex items-center gap-2 text-sm text-white/40">
              <LoaderCircle
                size={16}
                className="animate-spin"
              />
              Comprobando acceso LIVE...
            </div>
          ) : null}

          {isGuestWaiting ? (
            <LiveGuestWaitingPreview
              canUseCamera={
                activeGuestInvitation
                  ?.permissions
                  .canPublishCamera ??
                false
              }
              canUseMicrophone={
                activeGuestInvitation
                  ?.permissions
                  .canPublishMicrophone ??
                false
              }
            />
          ) : null}

            <div className="relative">
              <LiveViewerMedia
                roomId={roomId}
              />

              {isGuestOnStage ? (
                <LiveGuestStageOverlay
                  guestControls={guestMediaRef}
                  onClose={() => {
                    void handleLeaveGuestStage();
                  }}
                >
                  <LiveGuestMedia
                    ref={guestMediaRef}
                    roomId={roomId}
                  />
                </LiveGuestStageOverlay>
              ) : null}

              <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-[inherit]">
                {floatingReactions.map(
                  (reaction) => (
                    <span
                      key={reaction.id}
                      aria-hidden="true"
                      className="vyro-live-floating-reaction absolute bottom-[12%] text-4xl drop-shadow-[0_8px_18px_rgba(0,0,0,0.45)] sm:text-5xl"
                      style={{
                        left: `${reaction.x}%`,
                        transform: `translateX(-50%) scale(${reaction.scale})`,
                        ["--vyro-reaction-drift" as string]:
                          `${reaction.drift}px`,
                      }}
                    >
                      {reaction.emoji}
                    </span>
                  ),
                )}
              </div>

              <style>{`
                @keyframes vyro-live-reaction-float {
                  0% {
                    opacity: 0;
                    transform:
                      translate3d(-50%, 20px, 0)
                      scale(0.65);
                  }

                  12% {
                    opacity: 1;
                  }

                  55% {
                    opacity: 1;
                  }

                  100% {
                    opacity: 0;
                    transform:
                      translate3d(
                        calc(
                          -50% +
                          var(--vyro-reaction-drift)
                        ),
                        -260px,
                        0
                      )
                      scale(1.35);
                  }
                }

                .vyro-live-floating-reaction {
                  animation:
                    vyro-live-reaction-float
                    2.6s
                    cubic-bezier(
                      0.22,
                      0.75,
                      0.2,
                      1
                    )
                    forwards;
                  will-change:
                    transform,
                    opacity;
                }

                @media (
                  prefers-reduced-motion: reduce
                ) {
                  .vyro-live-floating-reaction {
                    animation-duration: 0.8s;
                  }
                }
              `}</style>

              <div className="pointer-events-none absolute right-4 top-16 z-30 flex justify-end sm:right-5 sm:top-20">
                <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-white/10 bg-black/45 p-1 shadow-[0_10px_30px_rgba(0,0,0,0.28)] backdrop-blur-md">
                  <div className="relative">
                    {reactionPickerOpen ? (
                      <div className="absolute bottom-[calc(100%+12px)] left-0 z-50 w-max max-w-[calc(100vw-2rem)]">
                        <div className="rounded-2xl border border-white/10 bg-black/90 p-2 shadow-[0_18px_60px_rgba(0,0,0,0.65)] backdrop-blur-2xl">
                          <div className="mb-1 px-2 pt-1">
                            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/40">
                              Reaccionar
                            </p>
                          </div>

                          <div className="flex items-center gap-1">
                            {reactionOptions.map(
                              (reaction) => (
                                <button
                                  key={
                                    reaction.type
                                  }
                                  type="button"
                                  title={
                                    reaction.label
                                  }
                                  aria-label={
                                    reaction.label
                                  }
                                  disabled={
                                    sendingReaction !==
                                    null
                                  }
                                  onClick={() => {
                                    void handleSendReaction(
                                      reaction.type,
                                    );
                                  }}
                                  className="group flex h-11 w-11 items-center justify-center rounded-xl text-2xl transition hover:-translate-y-1 hover:bg-white/10 disabled:cursor-wait disabled:opacity-40 sm:h-12 sm:w-12 sm:text-3xl"
                                >
                                  <span
                                    aria-hidden="true"
                                    className="transition-transform duration-200 group-hover:scale-125"
                                  >
                                    {
                                      reaction.emoji
                                    }
                                  </span>
                                </button>
                              ),
                            )}
                          </div>

                          {reactionError ? (
                            <p className="max-w-xs px-2 pb-1 pt-2 text-xs font-bold text-red-300">
                              {reactionError}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    ) : null}

                    <button
                      type="button"
                      aria-label="Reaccionar al LIVE"
                      aria-expanded={
                        reactionPickerOpen
                      }
                      onClick={async () => {
                        setReactionError("");

                        const allowed =
                          await requireViewerAuth(
                            "reaction",
                          );

                        if (!allowed) {
                          return;
                        }

                        setReactionPickerOpen(
                          (current) =>
                            !current,
                        );
                      }}
                      className={[
                        "flex h-9 items-center gap-1.5 rounded-full px-2.5 text-xs font-black text-white/90 transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60",
                        reactionPickerOpen
                          ? "bg-white/15 text-white shadow-sm"
                          : "hover:bg-white/10 hover:text-white",
                      ].join(" ")}
                    >
                      <span aria-hidden="true">
                        ❤️
                      </span>

                      <span className="hidden sm:inline">
                        Reaccionar
                      </span>

                      <span
                        aria-hidden="true"
                        className={[
                          "text-[10px] text-white/45 transition-transform",
                          reactionPickerOpen
                            ? "rotate-180"
                            : "",
                        ].join(" ")}
                      >
                        ▾
                      </span>
                    </button>
                  </div>

                  <button
                    type="button"
                    aria-label="Abrir comentarios"
                    aria-expanded={viewerPanel === "chat"}
                    onClick={async () => {
                      setReactionPickerOpen(false);

                      const allowed =
                        await requireViewerAuth(
                          "chat",
                        );

                      if (!allowed) {
                        return;
                      }

                      setViewerPanel((current) =>
                        current === "chat"
                          ? null
                          : "chat",
                      );
                    }}
                    className={[
                      "flex h-9 items-center gap-1.5 rounded-full px-2.5 text-xs font-black text-white/90 transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60",
                      viewerPanel === "chat"
                        ? "bg-white/15 text-white shadow-sm"
                        : "hover:bg-white/10 hover:text-white",
                    ].join(" ")}
                  >
                    <span aria-hidden="true">
                      💬
                    </span>

                    <span className="hidden sm:inline">
                      Comentar
                    </span>
                  </button>

                  <LiveGuestRequestButton
                    roomId={roomId}
                    hostId={room.hostId}
                    hasActiveInvitation={Boolean(
                      activeGuestInvitation,
                    )}
                    disabled={guestInvitationsLoading}
                    onAuthRequired={() => {
                      setViewerAuthAction("guest");
                      setViewerAuthGateOpen(true);
                    }}
                  />

                  <button
                    type="button"
                    aria-label="Enviar regalo"
                    aria-expanded={viewerPanel === "gifts"}
                    onClick={async () => {
                      setReactionPickerOpen(false);

                      const allowed =
                        await requireViewerAuth(
                          "gifts",
                        );

                      if (!allowed) {
                        return;
                      }

                      setViewerPanel((current) =>
                        current === "gifts"
                          ? null
                          : "gifts",
                      );
                    }}
                    className={[
                      "flex h-9 items-center gap-1.5 rounded-full px-2.5 text-xs font-black text-white/90 transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60",
                      viewerPanel === "gifts"
                        ? "bg-white/15 text-white shadow-sm"
                        : "hover:bg-white/10 hover:text-white",
                    ].join(" ")}
                  >
                    <span aria-hidden="true">
                      🎁
                    </span>

                    <span className="hidden sm:inline">
                      Regalo
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-label="Compartir LIVE"
                    onClick={() => {
                      void handleShareLive();
                    }}
                    className="flex h-9 items-center gap-1.5 rounded-full px-2.5 text-xs font-black text-white/90 transition duration-200 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60"
                  >
                    <Share2 size={16} />

                    <span className="hidden sm:inline">
                      {shareFeedback ||
                        "Compartir"}
                    </span>
                  </button>

                  <div className="mx-0.5 h-5 w-px bg-white/10" />

                  <div className="flex h-9 items-center gap-1 rounded-full px-2 text-[11px] font-black text-white/70">
                    <span
                      aria-hidden="true"
                      className="h-2 w-2 animate-pulse rounded-full bg-red-500"
                    />

                    <span>
                      {presenceCounters?.activeViewers ??
                        room.counters.activeViewers}
                    </span>
                  </div>
                </div>
              </div>
            </div>
        </section>
        {viewerAuthGateOpen ? (
          <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/15 p-4 backdrop-blur-[1px]">
            <div className="relative w-full max-w-md rounded-[2rem] border border-white/10 bg-[#07111D]/80 p-7 shadow-2xl backdrop-blur-xl">
              <button
                type="button"
                aria-label="Cerrar"
                onClick={() => {
                  setViewerAuthGateOpen(false);
                  setViewerAuthAction(null);
                }}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/20 text-lg font-black text-white transition hover:bg-white/10"
              >
                ×
              </button>

              <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
                VYRO LIVE
              </p>

              <h2 className="mt-3 text-2xl font-black text-white">
                Participa en este LIVE
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/60">
                {viewerAuthAction === "reaction"
                  ? "Inicia sesión para reaccionar en tiempo real."
                  : viewerAuthAction === "chat"
                    ? "Inicia sesión para comentar en este LIVE."
                    : viewerAuthAction === "follow"
                      ? "Inicia sesión para seguir a este creador."
                      : viewerAuthAction === "guest"
                        ? "Inicia sesión para solicitar subir al LIVE como Guest."
                        : "Inicia sesión para enviar regalos al creador."}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Link
                  href={`/login?returnTo=${encodeURIComponent(
                    `/live/watch/${roomId}`,
                  )}`}
                  className="flex h-12 items-center justify-center rounded-xl bg-cyan-300 px-5 text-sm font-black text-black transition hover:bg-cyan-200"
                >
                  Iniciar sesión
                </Link>

                <Link
                  href={`/register?returnTo=${encodeURIComponent(
                    `/live/watch/${roomId}`,
                  )}`}
                  className="flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] px-5 text-sm font-black text-white transition hover:bg-white/10"
                >
                  Crear cuenta
                </Link>
              </div>

              <p className="mt-5 text-center text-[11px] font-bold text-white/35">
                Puedes seguir viendo el LIVE sin iniciar sesión.
              </p>
            </div>
          </div>
        ) : null}
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
                {/* VYRO VIEWER FLOATING GIFTS */}
        <section
          className={
            viewerPanel === "gifts"
              ? "fixed inset-0 z-[90] flex items-center justify-center bg-black/[0.10] p-3 backdrop-blur-[1px] sm:p-6"
              : "mt-8"
          }
        >
          <div
            className={
              viewerPanel === "gifts"
                ? "relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-[2rem] shadow-[0_18px_55px_rgba(0,0,0,0.22)]"
                : ""
            }
          >
            {viewerPanel === "gifts" ? (
              <button
                type="button"
                aria-label="Cerrar regalos"
                onClick={() => {
                  setViewerPanel(null);
                }}
                className="absolute right-4 top-4 z-[100] flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/80 text-xl font-black text-white shadow-xl backdrop-blur-xl transition hover:bg-white/15"
              >
                ×
              </button>
            ) : null}

            <GiftPicker
              roomId={roomId}
              battleRecipients={
                liveBattle?.status === "active"
                  ? {
                      left: {
                        id:
                          liveBattle.left.creatorId,
                        name:
                          liveBattle.left.creatorName,
                      },
                      right: {
                        id:
                          liveBattle.right.creatorId,
                        name:
                          liveBattle.right.creatorName,
                      },
                    }
                  : null
              }
            />
          </div>
        </section>
                {/* VYRO VIEWER FLOATING CHAT */}
        <section
          className={
            viewerPanel === "chat"
              ? "fixed inset-0 z-[90] flex items-center justify-center bg-black/[0.10] p-3 backdrop-blur-[1px] sm:p-6"
              : "mt-8"
          }
        >
          <div
            className={
              viewerPanel === "chat"
                ? "relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] shadow-[0_18px_55px_rgba(0,0,0,0.22)]"
                : ""
            }
          >
            {viewerPanel === "chat" ? (
              <button
                type="button"
                aria-label="Cerrar comentarios"
                onClick={() => {
                  setViewerPanel(null);
                }}
                className="absolute right-4 top-4 z-[100] flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/80 text-xl font-black text-white shadow-xl backdrop-blur-xl transition hover:bg-white/15"
              >
                ×
              </button>
            ) : null}

            <LiveChatPanel
              messages={messages}
              loading={chatLoading}
              sending={chatSending}
              connected={chatConnected}
              error={chatError}
              onSendMessage={sendMessage}
            />
          </div>
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

"use client";

import {
  ChevronDown,
  Clock3,
  Gift,
  Grip,
  Heart,
  MessageCircle,
  Bell,
  Search,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import {
  cloneElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
  type ReactNode,
} from "react";

import FollowButton from "@/components/feed/FollowButton";
import PublicCreatorProfile from "@/components/profile/PublicCreatorProfile";
import type {
  LiveChatMessage,
} from "@/lib/live";
import { supabase } from "@/lib/supabase";

type CreatorPanel =
  | "viewers"
  | "reactions"
  | "messages"
  | "gifts"
  | "activity"
  | "search"
  | "guests"
  | "requests";

type PanelPosition = {
  x: number;
  y: number;
};

type ReactionProfile = {
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
};

type ReactionFeedRow = {
  id: string;
  user_id: string;
  reaction_type: string;
  intensity: number;
  created_at: string;
  profiles:
    | ReactionProfile[]
    | ReactionProfile
    | null;
};

type ReactionFeedItem = {
  id: string;
  user_id: string;
  reaction_type: string;
  intensity: number;
  created_at: string;
  profile: ReactionProfile | null;
};

type VyroCreatorControlStripProps = {
  roomId: string | null;
  activeViewers: number;
  peakViewers: number;
  totalJoins: number;
  reactions: number;
  messages: number;
  gifts: number;
  duration: string;
  chatMessages?: LiveChatMessage[];
  chatContent?: ReactElement<{
    creatorActions?: {
      roomId: string;
      currentUserId: string;
      onOpenProfile?: (userId: string) => void;
    };
  }>;
  searchContent?: ReactNode;
  guestContent?: ReactNode;
  requestsContent?: ReactNode;
  requestsCount?: number;
  beautyEnabled: boolean;
  onBeautyEnabledChange: (enabled: boolean) => void;
  beautyIntensity: "natural" | "medium" | "strong";
  onBeautyIntensityChange: (
    intensity: "natural" | "medium" | "strong",
  ) => void;
};

type ControlButtonProps = {
  active: boolean;
  label: string;
  value?: number;
  icon: ReactNode;
  onClick: () => void;
};

const initialPositions: Record<
  CreatorPanel,
  PanelPosition
> = {
  viewers: {
    x: 40,
    y: 120,
  },
  reactions: {
    x: 390,
    y: 135,
  },
  messages: {
    x: 720,
    y: 120,
  },
  gifts: {
    x: 80,
    y: 360,
  },
  activity: {
    x: 430,
    y: 380,
  },
  search: {
    x: 760,
    y: 390,
  },
  guests: {
    x: 280,
    y: 180,
  },
  requests: {
    x: 610,
    y: 180,
  },
};

const emptyOpenPanels: Record<
  CreatorPanel,
  boolean
> = {
  viewers: false,
  reactions: false,
  messages: false,
  gifts: false,
  activity: false,
  search: false,
  guests: false,
  requests: false,
};

const panelTitles: Record<
  CreatorPanel,
  string
> = {
  viewers: "Viewers LIVE",
  reactions: "Reactions LIVE",
  messages: "Chat LIVE",
  gifts: "Gifts LIVE",
  activity: "Activity LIVE",
  search: "Buscar LIVE",
  guests: "Guests LIVE",
  requests: "Solicitudes LIVE",
};

const reactionIcons: Record<
  string,
  string
> = {
  like: "👍",
  love: "❤️",
  fire: "🔥",
  wow: "😮",
  celebrate: "🎉",
  support: "🙌",
  vyro_energy: "⚡",
};

function ControlButton({
  active,
  label,
  value,
  icon,
  onClick,
}: ControlButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={active}
      className={[
        "group relative flex shrink-0 items-center gap-1.5 overflow-hidden rounded-full border px-3 py-1.5",
        "text-xs font-bold text-white transition-all duration-300 ease-out",
        active
          ? "border-cyan-300/70 bg-[linear-gradient(180deg,rgba(34,211,238,0.18),rgba(8,47,73,0.18))] shadow-[inset_0_0_0_1px_rgba(165,243,252,0.10),inset_0_0_14px_rgba(34,211,238,0.10),0_0_18px_rgba(34,211,238,0.22)]"
          : "border-cyan-200/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.025),0_6px_18px_rgba(0,0,0,0.18)] hover:-translate-y-px hover:border-cyan-300/45 hover:bg-cyan-400/[0.08] hover:shadow-[inset_0_0_0_1px_rgba(165,243,252,0.08),0_0_16px_rgba(34,211,238,0.14)]",
      ].join(" ")}
    >
      {icon}

      {typeof value === "number" ? (
        <span className="tabular-nums">
          {value}
        </span>
      ) : null}

      <span className="hidden text-white/55 2xl:inline">
        {label}
      </span>

      <ChevronDown
        size={12}
        className={[
          "text-white/35 transition-transform",
          active
            ? "rotate-180 text-cyan-300"
            : "",
        ].join(" ")}
      />
    </button>
  );
}

export function VyroCreatorControlStrip({
  roomId,
  activeViewers,
  peakViewers,
  totalJoins,
  reactions,
  messages,
  gifts,
  duration,
  chatMessages = [],
  chatContent,
  searchContent,
  guestContent,
  requestsContent,
  requestsCount = 0,
  beautyEnabled,
  onBeautyEnabledChange,
  beautyIntensity,
  onBeautyIntensityChange,
}: VyroCreatorControlStripProps) {
  const [beautyMenuOpen, setBeautyMenuOpen] =
    useState(false);

  const [
    profileUserId,
    setProfileUserId,
  ] = useState<string | null>(null);

  useEffect(() => {
    if (!profileUserId) {
      return;
    }

    const handleProfileEscape = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        setProfileUserId(null);
      }
    };

    window.addEventListener(
      "keydown",
      handleProfileEscape,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleProfileEscape,
      );
    };
  }, [profileUserId]);

  const beautyAnchorRef =
    useRef<HTMLDivElement>(null);

  const beautyMenuRef =
    useRef<HTMLDivElement>(null);

  const [beautyMenuPosition, setBeautyMenuPosition] =
    useState({
      left: 0,
      top: 0,
    });

  const toggleBeautyMenu = useCallback(() => {
    setBeautyMenuOpen((current) => {
      const next = !current;

      if (next && beautyAnchorRef.current) {
        const rect =
          beautyAnchorRef.current.getBoundingClientRect();

        const menuWidth = 280;

        const left = Math.max(
          8,
          Math.min(
            rect.left,
            window.innerWidth - menuWidth - 8,
          ),
        );

        setBeautyMenuPosition({
          left,
          top: rect.bottom + 8,
        });
      }

      return next;
    });
  }, []);

  const [
    openPanels,
    setOpenPanels,
  ] = useState<
    Record<CreatorPanel, boolean>
  >(emptyOpenPanels);

  const [
    positions,
    setPositions,
  ] = useState<
    Record<CreatorPanel, PanelPosition>
  >(initialPositions);

  const [
    minimizedPanels,
    setMinimizedPanels,
  ] = useState<
    Record<CreatorPanel, boolean>
  >({
    viewers: false,
    reactions: false,
    messages: false,
    gifts: false,
    activity: false,
    search: false,
    guests: false,
    requests: false,
  });

  const [
    maximizedPanel,
    setMaximizedPanel,
  ] = useState<CreatorPanel | null>(
    null,
  );

  const [
    panelZ,
    setPanelZ,
  ] = useState<
    Record<CreatorPanel, number>
  >({
    viewers: 100,
    reactions: 101,
    messages: 102,
    gifts: 103,
    activity: 104,
    search: 105,
    guests: 106,
    requests: 107,
  });

  const [
    ,
    setTopZ,
  ] = useState(107);

  const [
    reactionFeed,
    setReactionFeed,
  ] = useState<ReactionFeedItem[]>([]);

  const [
    reactionFeedConnected,
    setReactionFeedConnected,
  ] = useState(false);

  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");

  const dragRef =
    useRef<{
      panel: CreatorPanel;
      offsetX: number;
      offsetY: number;
    } | null>(null);

  const bringToFront =
    useCallback(
      (
        panel: CreatorPanel,
      ) => {
        setTopZ((current) => {
          const next =
            current + 1;

          setPanelZ(
            (currentZ) => ({
              ...currentZ,
              [panel]: next,
            }),
          );

          return next;
        });
      },
      [],
    );

  const togglePanel =
    useCallback(
      (
        panel: CreatorPanel,
      ) => {
        setOpenPanels(
          (current) => ({
            ...current,
            [panel]:
              !current[panel],
          }),
        );

        bringToFront(panel);
      },
      [
        bringToFront,
      ],
    );

  const closePanel =
    useCallback(
      (
        panel: CreatorPanel,
      ) => {
        setOpenPanels(
          (current) => ({
            ...current,
            [panel]: false,
          }),
        );
      },
      [],
    );

  const startDrag =
    useCallback(
      (
        panel: CreatorPanel,
        event:
          ReactPointerEvent<HTMLDivElement>,
      ) => {
        const target =
          event.target as HTMLElement;

        if (
          target.closest(
            "button,input,textarea,select,a",
          )
        ) {
          return;
        }

        const position =
          positions[panel];

        dragRef.current = {
          panel,
          offsetX:
            event.clientX -
            position.x,
          offsetY:
            event.clientY -
            position.y,
        };

        bringToFront(panel);
      },
      [
        bringToFront,
        positions,
      ],
    );

  const [panelSizes, setPanelSizes] = useState<
    Record<
      CreatorPanel,
      {
        width: number;
        height: number | null;
      }
    >
  >({
    viewers: { width: 430, height: null },
    reactions: { width: 430, height: null },
    messages: { width: 430, height: 560 },
    gifts: { width: 430, height: null },
    activity: { width: 430, height: null },
    search: { width: 430, height: null },
    guests: { width: 430, height: null },
    requests: { width: 430, height: null },
  });

  const resizeRef = useRef<{
    panel: CreatorPanel;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
  } | null>(null);

  const startResize = useCallback(
    (
      panel: CreatorPanel,
      event: ReactPointerEvent<HTMLDivElement>,
    ) => {
      event.preventDefault();
      event.stopPropagation();

      if (
        minimizedPanels[panel] ||
        maximizedPanel === panel
      ) {
        return;
      }

      const element =
        event.currentTarget.parentElement;

      if (!element) {
        return;
      }

      const rect =
        element.getBoundingClientRect();

      resizeRef.current = {
        panel,
        startX: event.clientX,
        startY: event.clientY,
        startWidth: rect.width,
        startHeight: rect.height,
      };

      bringToFront(panel);
    },
    [
      bringToFront,
      maximizedPanel,
      minimizedPanels,
    ],
  );

  useEffect(() => {
    const handleResizeMove = (
      event: PointerEvent,
    ) => {
      const resize = resizeRef.current;

      if (!resize) {
        return;
      }

      const maxWidth = Math.max(
        300,
        window.innerWidth -
          positions[resize.panel].x -
          8,
      );

      const maxHeight = Math.max(
        180,
        window.innerHeight -
          positions[resize.panel].y -
          8,
      );

      const width = Math.min(
        maxWidth,
        Math.max(
          300,
          resize.startWidth +
            event.clientX -
            resize.startX,
        ),
      );

      const height = Math.min(
        maxHeight,
        Math.max(
          180,
          resize.startHeight +
            event.clientY -
            resize.startY,
        ),
      );

      setPanelSizes((current) => ({
        ...current,
        [resize.panel]: {
          width,
          height,
        },
      }));
    };

    const handleResizeEnd = () => {
      resizeRef.current = null;
    };

    window.addEventListener(
      "pointermove",
      handleResizeMove,
    );

    window.addEventListener(
      "pointerup",
      handleResizeEnd,
    );

    window.addEventListener(
      "pointercancel",
      handleResizeEnd,
    );

    return () => {
      window.removeEventListener(
        "pointermove",
        handleResizeMove,
      );

      window.removeEventListener(
        "pointerup",
        handleResizeEnd,
      );

      window.removeEventListener(
        "pointercancel",
        handleResizeEnd,
      );
    };
  }, [positions]);

  useEffect(() => {
    const handlePointerMove = (
      event: PointerEvent,
    ) => {
      const drag =
        dragRef.current;

      if (!drag) {
        return;
      }

      const panelWidth =
        Math.min(
          430,
          Math.max(
            300,
            window.innerWidth - 16,
          ),
        );

      const maxX =
        Math.max(
          8,
          window.innerWidth -
            panelWidth -
            8,
        );

      const maxY =
        Math.max(
          80,
          window.innerHeight - 120,
        );

      const nextX =
        Math.min(
          maxX,
          Math.max(
            8,
            event.clientX -
              drag.offsetX,
          ),
        );

      const nextY =
        Math.min(
          maxY,
          Math.max(
            80,
            event.clientY -
              drag.offsetY,
          ),
        );

      setPositions(
        (current) => ({
          ...current,
          [drag.panel]: {
            x: nextX,
            y: nextY,
          },
        }),
      );
    };

    const handlePointerUp =
      () => {
        dragRef.current = null;
      };

    window.addEventListener(
      "pointermove",
      handlePointerMove,
    );

    window.addEventListener(
      "pointerup",
      handlePointerUp,
    );

    window.addEventListener(
      "pointercancel",
      handlePointerUp,
    );

    return () => {
      window.removeEventListener(
        "pointermove",
        handlePointerMove,
      );

      window.removeEventListener(
        "pointerup",
        handlePointerUp,
      );

      window.removeEventListener(
        "pointercancel",
        handlePointerUp,
      );
    };
  }, []);

  const refreshReactionFeed =
    useCallback(async () => {
      if (!roomId) {
        setReactionFeed([]);
        return;
      }

      const {
        data,
        error,
      } = await supabase
        .from("live_reactions")
        .select(
          "id,user_id,reaction_type,intensity,created_at,profiles(username,full_name,avatar_url)",
        )
        .eq(
          "room_id",
          roomId,
        )
        .order(
          "created_at",
          {
            ascending: false,
          },
        )
        .limit(40);

      if (error) {
        console.error(
          "VYRO creator reaction feed error:",
          error,
        );
        return;
      }

      const rows =
        (data ?? []) as ReactionFeedRow[];

      setReactionFeed(
        rows.map((row) => {
          const profile =
            Array.isArray(row.profiles)
              ? row.profiles[0] ?? null
              : row.profiles;

          return {
            id: row.id,
            user_id: row.user_id,
            reaction_type:
              row.reaction_type,
            intensity:
              row.intensity,
            created_at:
              row.created_at,
            profile,
          };
        }),
      );
    }, [
      roomId,
    ]);

  useEffect(() => {
    void refreshReactionFeed();
  }, [
    refreshReactionFeed,
  ]);

  useEffect(() => {
    if (!roomId) {
      setReactionFeedConnected(
        false,
      );
      return;
    }

    const channel =
      supabase
        .channel(
          `vyro-creator-reactions:${roomId}`,
        )
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table:
              "live_reactions",
            filter:
              `room_id=eq.${roomId}`,
          },
          () => {
            void refreshReactionFeed();
          },
        )
        .subscribe(
          (status) => {
            setReactionFeedConnected(
              status ===
                "SUBSCRIBED",
            );

            if (
              status ===
              "SUBSCRIBED"
            ) {
              void refreshReactionFeed();
            }
          },
        );

    return () => {
      setReactionFeedConnected(
        false,
      );

      void supabase.removeChannel(
        channel,
      );
    };
  }, [
    refreshReactionFeed,
    roomId,
  ]);

  const searchResults =
    useMemo(() => {
      const query =
        searchQuery
          .trim()
          .toLocaleLowerCase();

      if (!query) {
        return chatMessages.slice(
          -20,
        );
      }

      return chatMessages
        .filter(
          (message) => {
            const profileName =
              message.profile?.fullName ??
              "";

            const username =
              message.profile?.username ??
              "";

            return [
              profileName,
              username,
              message.message,
            ].some(
              (value) =>
                value
                  .toLocaleLowerCase()
                  .includes(query),
            );
          },
        )
        .slice(-30);
    }, [
      chatMessages,
      searchQuery,
    ]);

  function renderPanelContent(
    panel: CreatorPanel,
  ): ReactNode {
    if (
      panel === "viewers"
    ) {
      return (
        <div className="grid gap-3 p-4 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-[11px] font-black uppercase tracking-wider text-white/40">
              Viendo ahora
            </p>

            <p className="mt-2 text-3xl font-black text-cyan-300">
              {activeViewers}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-[11px] font-black uppercase tracking-wider text-white/40">
              Pico LIVE
            </p>

            <p className="mt-2 text-3xl font-black text-white">
              {peakViewers}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-[11px] font-black uppercase tracking-wider text-white/40">
              Entradas
            </p>

            <p className="mt-2 text-3xl font-black text-white">
              {totalJoins}
            </p>
          </div>
        </div>
      );
    }

    if (
      panel === "reactions"
    ) {
      return (
        <div className="p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-300">
                Reacciones recibidas
              </p>

              <p className="mt-1 text-2xl font-black text-white">
                {reactions}
              </p>
            </div>

            <div className={[
              "rounded-full border px-3 py-1 text-[10px] font-black",
              reactionFeedConnected
                ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-300"
                : "border-yellow-400/25 bg-yellow-400/10 text-yellow-300",
            ].join(" ")}>
              {reactionFeedConnected
                ? "REALTIME"
                : "CONECTANDO"}
            </div>
          </div>

          {reactionFeed.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center text-sm text-white/45">
              Las reacciones aparecerán aquí en tiempo real.
            </div>
          ) : (
            <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
              {reactionFeed.map(
                (reaction) => (
                  <div
                    key={
                      reaction.id
                    }
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-3"
                  >
                    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-pink-300/20 bg-pink-400/10 text-xl">
                      {reaction.profile?.avatar_url ? (
                        <span
                          role="img"
                          aria-label={
                            reaction.profile
                              .full_name ||
                            reaction.profile
                              .username ||
                            "Usuario VYRO"
                          }
                          className="h-full w-full bg-cover bg-center"
                          style={{
                            backgroundImage:
                              `url("${reaction.profile.avatar_url}")`,
                          }}
                        />
                      ) : (
                        <span>
                          {reactionIcons[
                            reaction
                              .reaction_type
                          ] ?? "✨"}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 items-center gap-2">
                        <p className="truncate text-sm font-black text-white">
                          {reaction.profile
                            ?.full_name ||
                            reaction.profile
                              ?.username ||
                            "Usuario VYRO"}
                        </p>

                        <span
                          className="shrink-0 text-base"
                          aria-hidden="true"
                        >
                          {reactionIcons[
                            reaction
                              .reaction_type
                          ] ?? "✨"}
                        </span>
                      </div>

                      <p className="truncate text-[11px] text-white/45">
                        {reaction.profile
                          ?.username
                          ? `@${reaction.profile.username} · `
                          : ""}
                        {reaction.reaction_type}
                        {" · "}
                        Intensidad{" "}
                        {reaction.intensity}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          setProfileUserId(
                            reaction.user_id,
                          )
                        }
                        className="h-8 rounded-md border border-cyan-300/25 bg-cyan-300/[0.08] px-3 text-xs font-black text-cyan-200 transition hover:border-cyan-300/50 hover:bg-cyan-300/[0.14]"
                      >
                        Perfil
                      </button>

                      <div className="[&>div>button]:h-8 [&>div>button]:min-h-0 [&>div>button]:rounded-md [&>div>button]:px-3 [&>div>button]:py-1 [&>div>button]:text-xs">
                        <FollowButton
                          creatorId={reaction.user_id}
                          ownLabel={null}
                        />
                      </div>

                      <time className="text-[10px] text-white/35">
                        {new Intl.DateTimeFormat(
                          "es-419",
                          {
                            hour:
                              "2-digit",
                            minute:
                              "2-digit",
                          },
                        ).format(
                          new Date(
                            reaction.created_at,
                          ),
                        )}
                      </time>
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </div>
      );
    }

    if (
      panel === "messages"
    ) {
      if (chatContent) {
        return cloneElement(chatContent, {
          creatorActions: chatContent.props.creatorActions
            ? {
                ...chatContent.props.creatorActions,
                onOpenProfile: setProfileUserId,
              }
            : undefined,
        });
      }

      return (
        <div className="p-5">
          <p className="text-sm text-white/50">
            {messages} mensajes registrados.
          </p>
        </div>
      );
    }

    if (
      panel === "gifts"
    ) {
      return (
        <div className="p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">
            Gifts LIVE
          </p>

          <p className="mt-3 text-4xl font-black text-white">
            {gifts}
          </p>

          <p className="mt-2 text-sm text-white/45">
            Regalos registrados durante esta transmisión.
          </p>
        </div>
      );
    }

    if (
      panel === "activity"
    ) {
      return (
        <div className="p-4">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
            Actividad LIVE
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs text-white/40">
                Entradas
              </p>

              <p className="mt-2 text-2xl font-black">
                {totalJoins}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs text-white/40">
                Chat
              </p>

              <p className="mt-2 text-2xl font-black">
                {messages}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs text-white/40">
                Reactions
              </p>

              <p className="mt-2 text-2xl font-black">
                {reactions}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs text-white/40">
                Gifts
              </p>

              <p className="mt-2 text-2xl font-black">
                {gifts}
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (
      panel === "search"
    ) {
      if (searchContent) {
        return searchContent;
      }

      return (
        <div className="p-4">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-300"
            />

            <input
              type="search"
              value={searchQuery}
              onChange={
                (event) => {
                  setSearchQuery(
                    event.target.value,
                  );
                }
              }
              placeholder="Buscar comentario o usuario..."
              className="w-full rounded-xl border border-white/10 bg-black/30 py-3 pl-10 pr-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-cyan-400/40"
            />
          </div>

          <div className="mt-4 max-h-[420px] space-y-2 overflow-y-auto">
            {searchResults.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center text-sm text-white/40">
                No hay coincidencias.
              </div>
            ) : (
              searchResults.map(
                (message) => {
                  const name =
                    message.profile?.fullName ||
                    message.profile?.username ||
                    "Usuario VYRO";

                  return (
                    <div
                      key={
                        message.id
                      }
                      className="rounded-xl border border-white/10 bg-white/[0.035] p-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-xs font-black text-cyan-200">
                          {name}
                        </p>

                        <time className="shrink-0 text-[10px] text-white/30">
                          {new Intl.DateTimeFormat(
                            "es-419",
                            {
                              hour:
                                "2-digit",
                              minute:
                                "2-digit",
                            },
                          ).format(
                            new Date(
                              message.createdAt,
                            ),
                          )}
                        </time>
                      </div>

                      <p className="mt-2 break-words text-sm text-white/70">
                        {
                          message.message
                        }
                      </p>
                    </div>
                  );
                },
              )
            )}
          </div>
        </div>
      );
    }

    if (
      panel === "requests"
    ) {
      return (
        requestsContent ?? (
          <div className="p-5 text-sm text-white/45">
            No hay solicitudes pendientes.
          </div>
        )
      );
    }

    return (
      guestContent ?? (
        <div className="p-5 text-sm text-white/45">
          Guest Control no disponible.
        </div>
      )
    );
  }

  const panels =
    Object.keys(
      openPanels,
    ) as CreatorPanel[];

  return (
    <>
      {profileUserId ? (
        <div
          className="fixed inset-0 z-[220] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Perfil VYRO"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setProfileUserId(null);
            }
          }}
        >
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-cyan-300/20 bg-[#070b12] shadow-[0_30px_100px_rgba(0,0,0,0.75)]">
            <button
              type="button"
              onClick={() =>
                setProfileUserId(null)
              }
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/70 text-white transition hover:border-cyan-300/50 hover:text-cyan-200"
              aria-label="Cerrar perfil"
              title="Cerrar perfil"
            >
              <X size={18} />
            </button>

            <div className="p-3 sm:p-5">
              <PublicCreatorProfile
                userId={profileUserId}
              />
            </div>
          </div>
        </div>
      ) : null}
      <div className="relative w-full">
        <div className="flex w-full items-center gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-black/70 px-3 py-2 shadow-2xl backdrop-blur-xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-4">
          <div
            className="relative h-8 w-[96px] shrink-0 overflow-hidden rounded-xl border border-cyan-300/55 bg-black/95 shadow-[inset_0_0_4px_rgba(255,255,255,0.10),inset_0_0_16px_rgba(34,211,238,0.16),0_0_8px_rgba(34,211,238,0.45),0_0_20px_rgba(34,211,238,0.22)]"
            aria-label="VYRO ON AIR"
          >
            <span
              className="vyro-led-word-vyro absolute inset-0 flex items-center justify-center gap-[2px] font-mono text-[11px] font-black text-cyan-200 [animation:vyro-led-vyro-shell_14s_linear_infinite]"
              aria-hidden="true"
            >
              <span className="vyro-led-vyro-char [animation:vyro-led-vyro-char_14s_cubic-bezier(0.22,1,0.36,1)_infinite] [text-shadow:0_0_2px_#ffffff,0_0_4px_#ffffff,0_0_7px_#a5f3fc,0_0_12px_#67e8f9,0_0_20px_#22d3ee,0_0_32px_#06b6d4,0_0_46px_rgba(6,182,212,1),0_0_64px_rgba(6,182,212,0.75)]">
                V
              </span>
              <span className="vyro-led-vyro-char [animation:vyro-led-vyro-char_14s_120ms_cubic-bezier(0.22,1,0.36,1)_infinite] [text-shadow:0_0_2px_#ffffff,0_0_4px_#ffffff,0_0_7px_#a5f3fc,0_0_12px_#67e8f9,0_0_20px_#22d3ee,0_0_32px_#06b6d4,0_0_46px_rgba(6,182,212,1),0_0_64px_rgba(6,182,212,0.75)]">
                Y
              </span>
              <span className="vyro-led-vyro-char [animation:vyro-led-vyro-char_14s_240ms_cubic-bezier(0.22,1,0.36,1)_infinite] [text-shadow:0_0_2px_#ffffff,0_0_4px_#ffffff,0_0_7px_#a5f3fc,0_0_12px_#67e8f9,0_0_20px_#22d3ee,0_0_32px_#06b6d4,0_0_46px_rgba(6,182,212,1),0_0_64px_rgba(6,182,212,0.75)]">
                R
              </span>
              <span className="vyro-led-vyro-char [animation:vyro-led-vyro-char_14s_360ms_cubic-bezier(0.22,1,0.36,1)_infinite] [text-shadow:0_0_2px_#ffffff,0_0_4px_#ffffff,0_0_7px_#a5f3fc,0_0_12px_#67e8f9,0_0_20px_#22d3ee,0_0_32px_#06b6d4,0_0_46px_rgba(6,182,212,1),0_0_64px_rgba(6,182,212,0.75)]">
                O
              </span>
            </span>

            <span
              className="vyro-led-word-onair absolute inset-0 flex items-center justify-center gap-[1px] rounded-lg border border-emerald-400/60 bg-emerald-400/15 font-mono text-[11px] font-black text-emerald-300 shadow-[inset_0_0_12px_rgba(52,211,153,0.30),0_0_9px_rgba(52,211,153,0.60),0_0_22px_rgba(52,211,153,0.40)] [animation:vyro-led-onair-shell_14s_linear_infinite]"
              aria-hidden="true"
            >
              <span className="vyro-led-onair-char [animation:vyro-led-onair-char_14s_cubic-bezier(0.22,1,0.36,1)_infinite] [text-shadow:0_0_2px_#ffffff,0_0_4px_#ffffff,0_0_7px_#d1fae5,0_0_12px_#6ee7b7,0_0_20px_#34d399,0_0_32px_#10b981,0_0_48px_rgba(16,185,129,1),0_0_68px_rgba(16,185,129,0.80)]">
                O
              </span>
              <span className="vyro-led-onair-char [animation:vyro-led-onair-char_14s_120ms_cubic-bezier(0.22,1,0.36,1)_infinite] [text-shadow:0_0_2px_#ffffff,0_0_4px_#ffffff,0_0_7px_#d1fae5,0_0_12px_#6ee7b7,0_0_20px_#34d399,0_0_32px_#10b981,0_0_48px_rgba(16,185,129,1),0_0_68px_rgba(16,185,129,0.80)]">
                N
              </span>
              <span className="ml-[3px] vyro-led-onair-char [animation:vyro-led-onair-char_14s_240ms_cubic-bezier(0.22,1,0.36,1)_infinite] [text-shadow:0_0_2px_#ffffff,0_0_4px_#ffffff,0_0_7px_#d1fae5,0_0_12px_#6ee7b7,0_0_20px_#34d399,0_0_32px_#10b981,0_0_48px_rgba(16,185,129,1),0_0_68px_rgba(16,185,129,0.80)]">
                A
              </span>
              <span className="vyro-led-onair-char [animation:vyro-led-onair-char_14s_360ms_cubic-bezier(0.22,1,0.36,1)_infinite] [text-shadow:0_0_2px_#ffffff,0_0_4px_#ffffff,0_0_7px_#d1fae5,0_0_12px_#6ee7b7,0_0_20px_#34d399,0_0_32px_#10b981,0_0_48px_rgba(16,185,129,1),0_0_68px_rgba(16,185,129,0.80)]">
                I
              </span>
              <span className="vyro-led-onair-char [animation:vyro-led-onair-char_14s_480ms_cubic-bezier(0.22,1,0.36,1)_infinite] [text-shadow:0_0_2px_#ffffff,0_0_4px_#ffffff,0_0_7px_#d1fae5,0_0_12px_#6ee7b7,0_0_20px_#34d399,0_0_32px_#10b981,0_0_48px_rgba(16,185,129,1),0_0_68px_rgba(16,185,129,0.80)]">
                R
              </span>
            </span>

            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle,rgba(103,232,249,0.55)_0.6px,transparent_0.8px)] [background-size:4px_4px]"
            />
          </div>

          <ControlButton
            active={
              openPanels.viewers
            }
            label="Viewers"
            value={activeViewers}
            icon={
              <Users
                size={14}
                className="text-cyan-300"
              />
            }
            onClick={() =>
              togglePanel(
                "viewers",
              )
            }
          />

          <ControlButton
            active={
              openPanels.reactions
            }
            label="Reactions"
            value={reactions}
            icon={
              <Heart
                size={14}
                className="text-pink-300"
              />
            }
            onClick={() =>
              togglePanel(
                "reactions",
              )
            }
          />

          <ControlButton
            active={
              openPanels.messages
            }
            label="Chat"
            value={messages}
            icon={
              <MessageCircle
                size={14}
                className="text-violet-300"
              />
            }
            onClick={() =>
              togglePanel(
                "messages",
              )
            }
          />

          <ControlButton
            active={
              openPanels.gifts
            }
            label="Gifts"
            value={gifts}
            icon={
              <Gift
                size={14}
                className="text-amber-300"
              />
            }
            onClick={() =>
              togglePanel(
                "gifts",
              )
            }
          />

          <div
            ref={beautyAnchorRef}
            className="shrink-0"
          >
            <ControlButton
              active={
                beautyMenuOpen ||
                beautyEnabled
              }
              label="Beauty"
              icon={
                <span className="text-sm leading-none">
                  ✨
                </span>
              }
              onClick={
                toggleBeautyMenu
              }
            />
          </div>

          <ControlButton
            active={
              openPanels.activity
            }
            label="Activity"
            value={totalJoins}
            icon={
              <UserPlus
                size={14}
                className="text-emerald-300"
              />
            }
            onClick={() =>
              togglePanel(
                "activity",
              )
            }
          />

          <ControlButton
            active={
              openPanels.search
            }
            label="Buscar"
            icon={
              <Search
                size={14}
                className="text-cyan-300"
              />
            }
            onClick={() =>
              togglePanel(
                "search",
              )
            }
          />

          <ControlButton
            active={
              openPanels.guests
            }
            label="Guests"
            icon={
              <Users
                size={14}
                className="text-fuchsia-300"
              />
            }
            onClick={() =>
              togglePanel(
                "guests",
              )
            }
          />

          <ControlButton
            active={
              openPanels.requests
            }
            label="Solicitudes"
            value={requestsCount}
            icon={
              <Bell
                size={14}
                className="text-amber-300"
              />
            }
            onClick={() =>
              togglePanel(
                "requests",
              )
            }
          />

          <div className="ml-auto flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-xs font-black tabular-nums text-white">
            <Clock3
              size={14}
              className="text-cyan-300"
            />

            {duration}
          </div>
        </div>

        {beautyMenuOpen && (
          <div
            ref={beautyMenuRef}
            className="fixed z-[140] w-[280px] overflow-hidden rounded-2xl border border-white/15 bg-[rgba(7,11,18,0.96)] shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl"
            style={{
              left:
                beautyMenuPosition.left,
              top:
                beautyMenuPosition.top,
            }}
          >
            <div className="border-b border-white/10 px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-cyan-300">
                    VYRO Beauty
                  </p>
                  <p className="mt-1 text-[11px] text-white/40">
                    Face Tracking Beauty
                  </p>
                </div>

                <span className="text-lg">
                  ✨
                </span>
              </div>
            </div>

            <div className="p-3">
              <button
                type="button"
                role="switch"
                aria-checked={
                  beautyEnabled
                }
                onClick={() =>
                  onBeautyEnabledChange(
                    !beautyEnabled,
                  )
                }
                className="flex w-full items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-3 text-left transition hover:border-cyan-300/30 hover:bg-white/[0.08]"
              >
                <div>
                  <p className="text-sm font-black text-white">
                    Skin Smooth
                  </p>
                  <p className="mt-1 text-[11px] text-white/40">
                    Suavizado facial en tiempo real
                  </p>
                </div>

                <span
                  className={[
                    "flex min-w-12 items-center justify-center rounded-full border px-2.5 py-1 text-[10px] font-black transition",
                    beautyEnabled
                      ? "border-emerald-300/40 bg-emerald-400/15 text-emerald-300"
                      : "border-white/15 bg-white/[0.06] text-white/45",
                  ].join(" ")}
                >
                  {beautyEnabled
                    ? "ON"
                    : "OFF"}
                </span>
              </button>

              <div className="mt-3 border-t border-white/10 pt-3">
                <p className="mb-2 px-1 text-[10px] font-black uppercase tracking-[0.14em] text-white/35">
                  Intensity
                </p>

                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      ["natural", "Natural"],
                      ["medium", "Medium"],
                      ["strong", "Strong"],
                    ] as const
                  ).map(([value, label]) => {
                    const selected =
                      beautyIntensity === value;

                    return (
                      <button
                        key={value}
                        type="button"
                        aria-pressed={selected}
                        disabled={!beautyEnabled}
                        onClick={() =>
                          onBeautyIntensityChange(
                            value,
                          )
                        }
                        className={[
                          "rounded-xl border px-2 py-2 text-[11px] font-black transition",
                          selected
                            ? "border-cyan-300/50 bg-cyan-400/15 text-cyan-200"
                            : "border-white/10 bg-white/[0.04] text-white/45 hover:border-white/20 hover:bg-white/[0.07]",
                          !beautyEnabled
                            ? "cursor-not-allowed opacity-35"
                            : "",
                        ].join(" ")}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {panels.map(
        (panel) => {
          if (
            !openPanels[panel]
          ) {
            return null;
          }

          return (
            <section
              key={panel}
              onPointerDown={() => {
                bringToFront(
                  panel,
                );
              }}
              className={`fixed overflow-hidden rounded-2xl border border-white/20 bg-[rgba(7,11,18,0.50)] shadow-[0_28px_90px_rgba(0,0,0,0.48)] backdrop-blur-xl transition-[width,height] duration-200 ${
                minimizedPanels[panel]
                  ? "h-auto w-[min(430px,calc(100vw-16px))]"
                  : maximizedPanel === panel
                    ? "h-[calc(100vh-32px)] w-[calc(100vw-32px)]"
                    : "w-[min(430px,calc(100vw-16px))]"
              }`}
              style={{
                left:
                  maximizedPanel === panel
                    ? 16
                    : positions[panel].x,
                top:
                  maximizedPanel === panel
                    ? 16
                    : positions[panel].y,
                zIndex:
                  panelZ[panel],
                width:
                  minimizedPanels[panel] ||
                  maximizedPanel === panel
                    ? undefined
                    : panelSizes[panel].width,
                height:
                  minimizedPanels[panel] ||
                  maximizedPanel === panel
                    ? undefined
                    : panelSizes[panel].height ??
                      undefined,
              }}
            >
              <div
                onPointerDown={
                  (event) =>
                    startDrag(
                      panel,
                      event,
                    )
                }
                className="flex cursor-move touch-none select-none items-center gap-3 border-b border-white/10 bg-white/[0.04] px-4 py-3"
              >
                <Grip
                  size={16}
                  className="shrink-0 text-cyan-300"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-black uppercase tracking-[0.16em] text-white">
                    {
                      panelTitles[
                        panel
                      ]
                    }
                  </p>

                  <p className="mt-0.5 text-[10px] text-white/35">
                    Arrastra esta barra para mover
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onPointerDown={(event) =>
                      event.stopPropagation()
                    }
                    onClick={(event) => {
                      event.stopPropagation();

                      setMinimizedPanels(
                        (current) => ({
                          ...current,
                          [panel]:
                            !current[panel],
                        }),
                      );

                      if (
                        maximizedPanel ===
                        panel
                      ) {
                        setMaximizedPanel(
                          null,
                        );
                      }

                      bringToFront(panel);
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-sm font-black text-white/65 transition hover:bg-white/15 hover:text-white"
                    aria-label={
                      minimizedPanels[panel]
                        ? `Restaurar ${panelTitles[panel]}`
                        : `Minimizar ${panelTitles[panel]}`
                    }
                    title={
                      minimizedPanels[panel]
                        ? "Restaurar"
                        : "Minimizar"
                    }
                  >
                    {minimizedPanels[panel]
                      ? "▢"
                      : "—"}
                  </button>

                  <button
                    type="button"
                    onPointerDown={(event) =>
                      event.stopPropagation()
                    }
                    onClick={(event) => {
                      event.stopPropagation();

                      setMinimizedPanels(
                        (current) => ({
                          ...current,
                          [panel]: false,
                        }),
                      );

                      setMaximizedPanel(
                        (current) =>
                          current === panel
                            ? null
                            : panel,
                      );

                      bringToFront(panel);
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-sm font-black text-white/65 transition hover:bg-white/15 hover:text-white"
                    aria-label={
                      maximizedPanel === panel
                        ? `Restaurar ${panelTitles[panel]}`
                        : `Maximizar ${panelTitles[panel]}`
                    }
                    title={
                      maximizedPanel === panel
                        ? "Restaurar"
                        : "Maximizar"
                    }
                  >
                    {maximizedPanel === panel
                      ? "❐"
                      : "□"}
                  </button>

                  <button
                    type="button"
                    onPointerDown={(event) =>
                      event.stopPropagation()
                    }
                    onClick={(event) => {
                      event.stopPropagation();

                      if (
                        maximizedPanel ===
                        panel
                      ) {
                        setMaximizedPanel(
                          null,
                        );
                      }

                      setMinimizedPanels(
                        (current) => ({
                          ...current,
                          [panel]: false,
                        }),
                      );

                      closePanel(panel);
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-white/60 transition hover:bg-red-500/20 hover:text-red-200"
                    aria-label={`Cerrar ${panelTitles[panel]}`}
                    title="Cerrar"
                  >
                    <X
                      size={15}
                    />
                  </button>
                </div>
              </div>

              {!minimizedPanels[
                panel
              ] &&
                maximizedPanel !==
                  panel && (
                  <div
                    onPointerDown={(event) =>
                      startResize(
                        panel,
                        event,
                      )
                    }
                    className="absolute bottom-0 right-0 z-30 h-6 w-6 cursor-se-resize touch-none"
                    title="Cambiar tamaño"
                    aria-label={`Cambiar tamaño de ${panelTitles[panel]}`}
                  >
                    <div className="absolute bottom-1 right-1 h-3 w-3 border-b-2 border-r-2 border-cyan-300/80" />
                  </div>
                )}

              {!minimizedPanels[
                panel
              ] && (
                <div
                  className={
                    maximizedPanel ===
                    panel
                      ? "h-[calc(100vh-96px)] overflow-y-auto"
                      : "max-h-[min(72vh,680px)] overflow-y-auto"
                  }
                >
                  {renderPanelContent(
                    panel,
                  )}
                </div>
              )}
            </section>
          );
        },
      )}

      <style jsx>{`
        @keyframes vyro-led-vyro-shell {
          0%,
          10% {
            opacity: 1;
            filter: brightness(1);
          }

          13% {
            opacity: 0.38;
            filter: brightness(0.65);
          }

          16% {
            opacity: 1;
            filter: brightness(1.35);
          }

          19% {
            opacity: 0.48;
            filter: brightness(0.72);
          }

          22% {
            opacity: 1;
            filter: brightness(1.45);
          }

          25% {
            opacity: 0.35;
            filter: brightness(0.62);
          }

          28% {
            opacity: 1;
            filter: brightness(1.5);
          }

          31% {
            opacity: 0.55;
            filter: brightness(0.78);
          }

          34%,
          40% {
            opacity: 1;
            filter: brightness(1.15);
          }

          43%,
          100% {
            opacity: 0;
            filter: brightness(0.5);
          }
        }

        @keyframes vyro-led-vyro-char {
          0% {
            opacity: 0;
            transform: translateY(8px) scale(0.55);
            filter: blur(4px);
          }

          2% {
            opacity: 0.25;
            transform: translateY(5px) scale(0.72);
            filter: blur(3px);
          }

          4% {
            opacity: 1;
            transform: translateY(-1px) scale(1.12);
            filter: blur(0);
          }

          6%,
          36% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }

          39% {
            opacity: 0.45;
            transform: translateY(-3px) scale(0.88);
            filter: blur(1px);
          }

          42%,
          100% {
            opacity: 0;
            transform: translateY(-8px) scale(0.58);
            filter: blur(4px);
          }
        }

        @keyframes vyro-led-onair-shell {
          0%,
          49% {
            opacity: 0;
            filter: brightness(0.5);
          }

          50%,
          60% {
            opacity: 1;
            filter: brightness(1);
          }

          63% {
            opacity: 0.38;
            filter: brightness(0.65);
          }

          66% {
            opacity: 1;
            filter: brightness(1.4);
          }

          69% {
            opacity: 0.45;
            filter: brightness(0.7);
          }

          72% {
            opacity: 1;
            filter: brightness(1.5);
          }

          75% {
            opacity: 0.34;
            filter: brightness(0.62);
          }

          78% {
            opacity: 1;
            filter: brightness(1.55);
          }

          81% {
            opacity: 0.52;
            filter: brightness(0.76);
          }

          84%,
          91% {
            opacity: 1;
            filter: brightness(1.18);
          }

          94%,
          100% {
            opacity: 0;
            filter: brightness(0.5);
          }
        }

        @keyframes vyro-led-onair-char {
          0%,
          50% {
            opacity: 0;
            transform: translateY(8px) scale(0.55);
            filter: blur(4px);
          }

          52% {
            opacity: 0.25;
            transform: translateY(5px) scale(0.72);
            filter: blur(3px);
          }

          54% {
            opacity: 1;
            transform: translateY(-1px) scale(1.12);
            filter: blur(0);
          }

          56%,
          87% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }

          90% {
            opacity: 0.45;
            transform: translateY(-3px) scale(0.88);
            filter: blur(1px);
          }

          93%,
          100% {
            opacity: 0;
            transform: translateY(-8px) scale(0.58);
            filter: blur(4px);
          }
        }
      `}</style>
    </>
  );
}

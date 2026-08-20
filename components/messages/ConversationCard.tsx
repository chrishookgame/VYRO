"use client";

type ConversationCardProps = {
  conversationId: string;
  username: string;
  fullName: string;
  lastMessage: string;
  unreadCount: number;
  selected: boolean;
  onSelect: (
    conversationId: string,
  ) => void;
};

export default function ConversationCard({
  conversationId,
  username,
  fullName,
  lastMessage,
  unreadCount,
  selected,
  onSelect,
}: ConversationCardProps) {
  const displayInitial =
    username
      .charAt(0)
      .toUpperCase();

  return (
    <button
      type="button"
      onClick={() =>
        onSelect(conversationId)
      }
      className={
        selected
          ? "flex w-full items-center gap-4 rounded-2xl border border-cyan-400/40 bg-cyan-500/15 p-4 text-left"
          : "flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-cyan-400/30 hover:bg-white/10"
      }
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-600 font-black text-black">
        {displayInitial}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="min-w-0 flex-1 truncate font-bold text-white">
            @{username}
          </p>

          {unreadCount > 0 ? (
            <span className="flex min-w-6 shrink-0 items-center justify-center rounded-full bg-cyan-400 px-2 py-1 text-xs font-black text-black">
              {unreadCount > 99
                ? "99+"
                : unreadCount}
            </span>
          ) : null}
        </div>

        <p className="truncate text-sm text-slate-400">
          {fullName || "Miembro VYRO"}
        </p>

        {lastMessage ? (
          <p
            className={
              unreadCount > 0
                ? "mt-1 truncate text-sm font-bold text-white"
                : "mt-1 truncate text-sm text-slate-500"
            }
          >
            {lastMessage}
          </p>
        ) : null}
      </div>
    </button>
  );
}

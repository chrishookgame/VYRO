"use client";

type ConversationCardProps = {
  conversationId: string;
  username: string;
  fullName: string;
  selected: boolean;
  onSelect: (
    conversationId: string,
  ) => void;
};

export default function ConversationCard({
  conversationId,
  username,
  fullName,
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

      <div className="min-w-0">
        <p className="truncate font-bold text-white">
          @{username}
        </p>

        <p className="truncate text-sm text-slate-400">
          {fullName || "Miembro VYRO"}
        </p>
      </div>
    </button>
  );
}

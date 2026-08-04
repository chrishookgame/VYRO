import type { PrestigeRankDefinition } from "@/lib/prestige";

interface PrestigeBadgeProps {
  rank: PrestigeRankDefinition;
  compact?: boolean;
}

export default function PrestigeBadge({
  rank,
  compact = false,
}: PrestigeBadgeProps) {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-cyan-100"
      title={rank.description}
    >
      <span aria-hidden="true">{rank.icon}</span>

      <span className="font-bold">
        {compact ? rank.name.replace("VYRO ", "") : rank.name}
      </span>
    </div>
  );
}

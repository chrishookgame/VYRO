"use client";

import type {
  BattleStoryParagraph,
} from "./types";

interface BattleStoryCardProps {
  paragraph: BattleStoryParagraph;
}

export default function BattleStoryCard({
  paragraph,
}: BattleStoryCardProps) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-fuchsia-200/70">
        {paragraph.title}
      </p>

      <p className="mt-3 text-sm leading-7 text-white/60">
        {paragraph.text}
      </p>
    </article>
  );
}

"use client";

import {
  BookOpenText,
  BrainCircuit,
  Sparkles,
} from "lucide-react";

import BattleStoryCard from "./BattleStoryCard";

import type {
  BattleStoryData,
} from "./types";

interface BattleStoryProps {
  story: BattleStoryData;
}

export default function BattleStory({
  story,
}: BattleStoryProps) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-fuchsia-400/15 bg-[linear-gradient(145deg,#120A18,#080B12)]">
      <header className="border-b border-white/10 px-6 py-6">
        <div className="flex items-center gap-2 text-fuchsia-200">
          <BrainCircuit size={20} />

          <p className="text-xs font-black uppercase tracking-[0.24em]">
            VYRO AI Battle Story
          </p>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <BookOpenText
            size={28}
            className="text-fuchsia-200"
          />

          <h2 className="text-3xl font-black text-white">
            {story.headline}
          </h2>
        </div>

        <p className="mt-4 max-w-4xl text-sm leading-7 text-white/55">
          {story.introduction}
        </p>
      </header>

      <div className="grid gap-4 p-5 lg:grid-cols-2">
        {story.paragraphs.map(
          (paragraph) => (
            <BattleStoryCard
              key={paragraph.id}
              paragraph={paragraph}
            />
          ),
        )}
      </div>

      <footer className="border-t border-white/10 px-6 py-5">
        <div className="flex items-start gap-3">
          <Sparkles
            size={18}
            className="mt-1 shrink-0 text-yellow-200"
          />

          <p className="text-sm leading-7 text-white/55">
            {story.ending}
          </p>
        </div>
      </footer>
    </section>
  );
}

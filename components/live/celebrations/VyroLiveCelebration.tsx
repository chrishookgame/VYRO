"use client";

import { useEffect } from "react";

import {
  Crown,
  Sparkles,
} from "lucide-react";

import VyroLevelUpCelebration from "./VyroLevelUpCelebration";
import VyroWinStreakCelebration from "./VyroWinStreakCelebration";

import type {
  VyroLiveCelebrationEvent,
} from "./types";

interface VyroLiveCelebrationProps {
  event: VyroLiveCelebrationEvent | null;
  onComplete: () => void;
}

export default function VyroLiveCelebration({
  event,
  onComplete,
}: VyroLiveCelebrationProps) {
  useEffect(() => {
    if (
      !event ||
      !event.visible
    ) {
      return;
    }

    const durationMs =
      event.intensity ===
      "legendary"
        ? 6500
        : event.intensity ===
            "epic"
          ? 5200
          : 4000;

    const timeout =
      window.setTimeout(
        onComplete,
        durationMs,
      );

    return () => {
      window.clearTimeout(
        timeout,
      );
    };
  }, [
    event,
    onComplete,
  ]);
  if (
    !event ||
    !event.visible
  ) {
    return null;
  }

  if (
    event.type === "LEVEL_UP" &&
    event.levelName
  ) {
    return (
      <VyroLevelUpCelebration
        creatorName={
          event.creatorName
        }
        levelName={
          event.levelName
        }
        intensity={
          event.intensity
        }
      />
    );
  }

  if (
    event.type === "WIN_STREAK" &&
    event.streak
  ) {
    return (
      <VyroWinStreakCelebration
        creatorName={
          event.creatorName
        }
        streak={
          event.streak
        }
        intensity={
          event.intensity
        }
      />
    );
  }

  return (
    <section className="rounded-[2rem] border border-fuchsia-300/20 bg-[linear-gradient(145deg,#190A20,#090A10)] p-6">
      <div className="flex items-center gap-2 text-fuchsia-200">
        {event.type === "TITLE_GAINED" ? (
          <Crown size={21} />
        ) : (
          <Sparkles size={21} />
        )}

        <p className="text-xs font-black uppercase tracking-[0.24em]">
          VYRO LIVE MOMENT
        </p>
      </div>

      <h2 className="mt-4 text-3xl font-black text-white">
        {event.title}
      </h2>

      <p className="mt-3 text-sm leading-7 text-white/55">
        {event.message}
      </p>
    </section>
  );
}

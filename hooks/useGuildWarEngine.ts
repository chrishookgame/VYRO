"use client";

import {
  useMemo,
} from "react";

import {
  createGuildWarState,
} from "@/components/live/guildwars/engine/GuildWarEngine";

import type {
  GuildWarBattle,
} from "@/components/live/guildwars/types/GuildWarTypes";

export function useGuildWarEngine(
  season: number,
  battles: GuildWarBattle[],
) {
  return useMemo(
    () =>
      createGuildWarState(
        season,
        battles,
      ),
    [
      season,
      battles,
    ],
  );
}

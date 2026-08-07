"use client";

import {
  useMemo,
} from "react";

import {
  createWorldLeagueState,
} from "@/components/live/worldleague/engine/WorldLeagueEngine";

import {
  createWorldLeagueRanking,
} from "@/components/live/worldleague/ranking/WorldLeagueRanking";

import type {
  WorldLeaguePlayer,
} from "@/components/live/worldleague/types/WorldLeagueTypes";

export function useWorldLeagueEngine(
  season: number,
  players: WorldLeaguePlayer[],
  active: boolean,
) {
  return useMemo(
    () => ({
      state:
        createWorldLeagueState(
          season,
          players,
          active,
        ),

      ranking:
        createWorldLeagueRanking(
          players,
        ),
    }),
    [
      season,
      players,
      active,
    ],
  );
}

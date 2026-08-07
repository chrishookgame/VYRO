"use client";

import {
  useMemo,
} from "react";

import {
  createWorldCircuitState,
} from "@/components/live/worldcircuit/engine/WorldCircuitEngine";

import {
  createWorldCircuitRanking,
} from "@/components/live/worldcircuit/ranking/WorldCircuitRanking";

import type {
  WorldCircuitCompetitor,
} from "@/components/live/worldcircuit/types/WorldCircuitTypes";

export function useWorldCircuitEngine(
  season: number,
  competitors: WorldCircuitCompetitor[],
  qualified: number,
  championId: string | null,
  active: boolean,
) {
  return useMemo(
    () => ({
      state:
        createWorldCircuitState(
          season,
          competitors,
          qualified,
          championId,
          active,
        ),

      ranking:
        createWorldCircuitRanking(
          competitors,
        ),
    }),
    [
      season,
      competitors,
      qualified,
      championId,
      active,
    ],
  );
}

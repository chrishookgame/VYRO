"use client";

import {
  useMemo,
} from "react";

import {
  createWorldTournamentState,
} from "@/components/live/worldtournaments/engine/WorldTournamentEngine";

import {
  createWorldTournamentRanking,
} from "@/components/live/worldtournaments/ranking/WorldTournamentRanking";

import type {
  WorldTournamentMatch,
  WorldTournamentPlayer,
} from "@/components/live/worldtournaments/types/WorldTournamentTypes";

export function useWorldTournamentEngine(
  tournamentId: string,
  season: number,
  players: WorldTournamentPlayer[],
  matches: WorldTournamentMatch[],
  championId: string | null,
  active: boolean,
) {
  return useMemo(
    () => ({
      state:
        createWorldTournamentState(
          tournamentId,
          season,
          players,
          matches,
          championId,
          active,
        ),

      ranking:
        createWorldTournamentRanking(
          players,
        ),
    }),
    [
      tournamentId,
      season,
      players,
      matches,
      championId,
      active,
    ],
  );
}

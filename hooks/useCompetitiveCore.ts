"use client";

import {
  useMemo,
} from "react";

import {
  createCompetitiveCoreState,
} from "@/components/live/competitivecore/engine/CompetitiveCoreEngine";

import {
  createUnifiedCompetitiveRanking,
} from "@/components/live/competitivecore/ranking/UnifiedCompetitiveRanking";

import {
  qualifyCompetitivePlayers,
} from "@/components/live/competitivecore/qualification/CrossSystemQualification";

import type {
  CompetitivePlayer,
} from "@/components/live/competitivecore/types/CompetitiveCoreTypes";

export function useCompetitiveCore(
  season: number,
  players: CompetitivePlayer[],
  active: boolean,
  minimumPower: number,
  qualificationLimit: number,
) {
  return useMemo(
    () => {
      const ranking =
        createUnifiedCompetitiveRanking(
          players,
        );

      const qualified =
        qualifyCompetitivePlayers(
          players,
          minimumPower,
          qualificationLimit,
        );

      return {
        state:
          createCompetitiveCoreState(
            season,
            players,
            active,
            qualified.length,
          ),

        ranking,

        qualified,
      };
    },
    [
      season,
      players,
      active,
      minimumPower,
      qualificationLimit,
    ],
  );
}

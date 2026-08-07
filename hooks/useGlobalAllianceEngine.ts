"use client";

import {
  useMemo,
} from "react";

import {
  createGlobalAllianceState,
} from "@/components/live/globalalliances/engine/GlobalAllianceEngine";

import {
  createAllianceRanking,
} from "@/components/live/globalalliances/ranking/AllianceRanking";

import type {
  AllianceWar,
  GlobalAlliance,
} from "@/components/live/globalalliances/types/GlobalAllianceTypes";

export function useGlobalAllianceEngine(
  season: number,
  alliances: GlobalAlliance[],
  wars: AllianceWar[],
) {
  return useMemo(
    () => ({
      state:
        createGlobalAllianceState(
          season,
          alliances,
          wars,
        ),

      ranking:
        createAllianceRanking(
          alliances,
        ),
    }),
    [
      season,
      alliances,
      wars,
    ],
  );
}

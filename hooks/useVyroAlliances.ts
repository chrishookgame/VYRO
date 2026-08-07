"use client";

import {
  useMemo,
} from "react";

import {
  createAllianceRanking,
} from "@/components/live/alliances/ranking/AllianceRanking";

import type {
  VyroAlliance,
} from "@/components/live/wars/types";

export function useVyroAlliances(
  alliances: VyroAlliance[],
) {
  return useMemo(
    () =>
      createAllianceRanking(
        alliances,
      ),
    [alliances],
  );
}

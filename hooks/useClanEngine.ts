"use client";

import {
  useMemo,
} from "react";

import {
  createClanState,
} from "@/components/live/clans/ClanEngine";

import type {
  VyroClan,
} from "@/components/live/clans/types";

export function useClanEngine(
  clans:VyroClan[],
) {
  return useMemo(
    () =>
      createClanState(
        clans,
      ),
    [clans],
  );
}

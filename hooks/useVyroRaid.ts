"use client";

import {
  useMemo,
} from "react";

import {
  calculateRaid,
} from "@/components/live/raids/RaidEngine";

import type {
  VyroRaidBoss,
  VyroRaidPlayer,
} from "@/components/live/wars/types";

export function useVyroRaid(
  boss: VyroRaidBoss,
  players: VyroRaidPlayer[],
) {
  return useMemo(
    () =>
      calculateRaid(
        boss,
        players,
      ),
    [
      boss,
      players,
    ],
  );
}

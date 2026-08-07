"use client";

import {
  useMemo,
} from "react";

import {
  createBossRaidState,
} from "@/components/live/raids/BossRaidStateEngine";

import {
  createBossRaidDamageRanking,
  calculateTotalRaidDamage,
} from "@/components/live/raids/damage/BossRaidDamageRanking";

import type {
  RaidState,
} from "@/components/live/raids/types";

export function useRaidEngine(
  state: RaidState,
) {
  return useMemo(
    () => {
      const raid =
        createBossRaidState(
          state,
        );

      const damageRanking =
        createBossRaidDamageRanking(
          state.players,
        );

      const totalDamage =
        calculateTotalRaidDamage(
          state.players,
        );

      return {
        raid,
        damageRanking,
        totalDamage,
      };
    },
    [state],
  );
}

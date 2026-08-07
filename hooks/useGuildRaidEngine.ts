"use client";

import {
  useMemo,
} from "react";

import {
  calculateGuildTeamPower,
} from "@/components/live/guildraids/teams/GuildTeamEngine";

import {
  createGuildRaidRanking,
} from "@/components/live/guildraids/ranking/GuildRaidRanking";

import type {
  GuildRaidState,
} from "@/components/live/guildraids/types/GuildRaidTypes";

export function useGuildRaidEngine(
  state: GuildRaidState,
) {
  return useMemo(
    () => {
      const teams =
        state.teams.map(
          team => ({
            ...team,

            raidPower:
              calculateGuildTeamPower(
                team,
              ),
          }),
        );

      const ranking =
        createGuildRaidRanking(
          state.teams,
        );

      return {
        state,
        teams,
        ranking,
      };
    },
    [state],
  );
}

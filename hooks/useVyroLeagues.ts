"use client";

import { useMemo } from "react";

import type {
  NextChallengerData,
} from "@/components/live/battle/challenger/types";

import type {
  VyroLeague,
  VyroLeaguePlayer,
  VyroLeagueState,
} from "@/components/live/leagues/types";

interface UseVyroLeaguesInput {
  nextChallenger: NextChallengerData;
}

const ORDER: VyroLeague[] = [
  "BRONZE",
  "SILVER",
  "GOLD",
  "DIAMOND",
  "ROYAL",
  "INFINITY",
];

function resolveLeague(score: number): VyroLeague {
  if (score >= 6000) return "INFINITY";
  if (score >= 4500) return "ROYAL";
  if (score >= 3000) return "DIAMOND";
  if (score >= 1800) return "GOLD";
  if (score >= 900) return "SILVER";
  return "BRONZE";
}

export function useVyroLeagues({
  nextChallenger,
}: UseVyroLeaguesInput) {
  return useMemo(() => {

    const champion =
      nextChallenger.champion;

    if (!champion) {
      const empty: VyroLeagueState = {
        currentLeague: "BRONZE",
        player: null,
        nextLeague: "SILVER",
        previousLeague: null,
        season: 1,
      };

      return {
        state: empty,
      };
    }

    const league =
      resolveLeague(champion.score);

    const index =
      ORDER.indexOf(league);

    const progress =
      Math.min(
        100,
        Math.round(
          (champion.winRate + champion.streak * 3),
        ),
      );

    const risk =
      Math.max(
        0,
        100 - progress,
      );

    const player: VyroLeaguePlayer = {
      creatorId:
        champion.creatorId,

      creatorName:
        champion.creatorName,

      league,

      leaguePoints:
        champion.score,

      wins:
        champion.battleWins,

      losses:
        Math.max(
          0,
          champion.battleWins -
          champion.streak,
        ),

      streak:
        champion.streak,

      promotionProgress:
        progress,

      relegationRisk:
        risk,

      worldRank: 1,
    };

    const state: VyroLeagueState = {

      currentLeague:
        league,

      player,

      nextLeague:
        index < ORDER.length - 1
          ? ORDER[index + 1]
          : null,

      previousLeague:
        index > 0
          ? ORDER[index - 1]
          : null,

      season: 1,
    };

    return {
      state,
    };

  }, [nextChallenger]);
}

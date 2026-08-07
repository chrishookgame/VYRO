"use client";

import {
  useMemo,
} from "react";

import type {
  BattleRankingEvolutionData,
  BattleRankingCreator,
} from "@/components/live/battle/ranking/types";

import type {
  VyroTitlesState,
} from "@/components/live/battle/titles/types";

import type {
  VyroHallOfFameData,
  VyroHallOfFameEntry,
} from "@/components/live/battle/halloffame/types";

interface UseVyroHallOfFameInput {
  ranking: BattleRankingEvolutionData;
  titles: VyroTitlesState;

  countryCode?: string;
  countryName?: string;
}

function getTitle(
  creatorId: string,
  titles: VyroTitlesState,
): string | null {
  if (
    titles.king?.creatorId ===
    creatorId
  ) {
    return "VYRO KING";
  }

  if (
    titles.legend?.creatorId ===
    creatorId
  ) {
    return "VYRO LEGEND";
  }

  if (
    titles.elite?.creatorId ===
    creatorId
  ) {
    return "VYRO ELITE";
  }

  return null;
}

function buildEntry(
  creator: BattleRankingCreator,
  titles: VyroTitlesState,
  countryCode: string,
  countryName: string,
): VyroHallOfFameEntry {
  const totalBattles =
    creator.wins +
    creator.losses +
    creator.draws;

  const currentTitle =
    getTitle(
      creator.creatorId,
      titles,
    );

  const championships =
    currentTitle === "VYRO KING"
      ? 1
      : 0;

  const titleDefenses =
    currentTitle === "VYRO KING"
      ? Math.max(
          0,
          creator.streak - 1,
        )
      : 0;

  const daysAsChampion =
    championships > 0
      ? creator.wins * 2
      : 0;

  const legacyScore =
    Math.max(
      0,
      Math.round(
        creator.score +
          creator.wins * 120 +
          creator.streak * 80 +
          championships * 500 +
          titleDefenses * 150 +
          daysAsChampion * 5,
      ),
    );

  const inducted =
    legacyScore >= 1500 ||
    creator.wins >= 10 ||
    titleDefenses >= 5;

  return {
    creatorId:
      creator.creatorId,

    creatorName:
      creator.creatorName,

    countryCode,
    countryName,

    currentTitle,

    highestTitle:
      currentTitle,

    totalWins:
      creator.wins,

    totalBattles,

    bestStreak:
      creator.streak,

    championships,

    titleDefenses,

    daysAsChampion,

    score:
      creator.score,

    legacyScore,

    inducted,
  };
}

export function useVyroHallOfFame({
  ranking,
  titles,
  countryCode = "CL",
  countryName = "Chile",
}: UseVyroHallOfFameInput) {
  const data =
    useMemo<
      VyroHallOfFameData
    >(() => {
      const entries =
        [
          ranking.left
            ? buildEntry(
                ranking.left,
                titles,
                countryCode,
                countryName,
              )
            : null,

          ranking.right
            ? buildEntry(
                ranking.right,
                titles,
                countryCode,
                countryName,
              )
            : null,
        ]
          .filter(
            (
              entry,
            ): entry is VyroHallOfFameEntry =>
              entry !== null,
          )
          .sort(
            (a, b) =>
              b.legacyScore -
              a.legacyScore,
          );

      const leader =
        entries[0] ??
        null;

      const totalLegends =
        entries.filter(
          (entry) =>
            entry.inducted,
        ).length;

      return {
        entries,
        leader,
        totalLegends,
      };
    }, [
      countryCode,
      countryName,
      ranking,
      titles,
    ]);

  return {
    data,
  };
}

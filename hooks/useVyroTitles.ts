"use client";

import {
  useMemo,
} from "react";

import type {
  BattleRankingEvolutionData,
} from "@/components/live/battle/ranking/types";

import type {
  VyroNationalTitle,
  VyroTitleHolder,
  VyroTitlesState,
} from "@/components/live/battle/titles/types";

interface UseVyroTitlesInput {
  ranking: BattleRankingEvolutionData;

  countryCode: string;
  countryName: string;

  leftFollowers?: number;
  rightFollowers?: number;
}

function buildHolder(
  title: VyroNationalTitle,
  rank: 1 | 2 | 3,
  creatorId: string,
  creatorName: string,
  score: number,
  wins: number,
  battles: number,
  followers: number,
  countryCode: string,
  countryName: string,
): VyroTitleHolder {
  return {
    creatorId,
    creatorName,

    countryCode,
    countryName,

    title,
    rank,

    score,
    followers,
    battleWins:
      wins,
    battleCount:
      battles,

    active:
      true,

    acquiredAt:
      null,

    previousHolderName:
      null,
  };
}

export function useVyroTitles({
  ranking,
  countryCode,
  countryName,
  leftFollowers = 0,
  rightFollowers = 0,
}: UseVyroTitlesInput) {
  const state =
    useMemo<
      VyroTitlesState
    >(() => {
      const candidates =
        [
          ranking.left
            ? {
                creator:
                  ranking.left,
                followers:
                  leftFollowers,
              }
            : null,

          ranking.right
            ? {
                creator:
                  ranking.right,
                followers:
                  rightFollowers,
              }
            : null,
        ]
          .filter(
            Boolean,
          )
          .map(
            (item) =>
              item!,
          )
          .sort(
            (a, b) =>
              b.creator.score -
                a.creator.score ||
              b.followers -
                a.followers ||
              b.creator.wins -
                a.creator.wins,
          );

      const first =
        candidates[0];

      const second =
        candidates[1];

      const third =
        candidates[2];

      const king =
        first
          ? buildHolder(
              "VYRO_KING",
              1,
              first.creator.creatorId,
              first.creator.creatorName,
              first.creator.score,
              first.creator.wins,
              first.creator.wins +
                first.creator.losses +
                first.creator.draws,
              first.followers,
              countryCode,
              countryName,
            )
          : null;

      const legend =
        second
          ? buildHolder(
              "VYRO_LEGEND",
              2,
              second.creator.creatorId,
              second.creator.creatorName,
              second.creator.score,
              second.creator.wins,
              second.creator.wins +
                second.creator.losses +
                second.creator.draws,
              second.followers,
              countryCode,
              countryName,
            )
          : null;

      const elite =
        third
          ? buildHolder(
              "VYRO_ELITE",
              3,
              third.creator.creatorId,
              third.creator.creatorName,
              third.creator.score,
              third.creator.wins,
              third.creator.wins +
                third.creator.losses +
                third.creator.draws,
              third.followers,
              countryCode,
              countryName,
            )
          : null;

      return {
        king,
        legend,
        elite,
        changes: [],
      };
    }, [
      countryCode,
      countryName,
      leftFollowers,
      ranking,
      rightFollowers,
    ]);

  return {
    state,
  };
}

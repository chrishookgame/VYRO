"use client";

import {
  useMemo,
} from "react";

import type {
  BattleRankingEvolutionData,
} from "@/components/live/battle/ranking/types";

import type {
  VyroTitlesState,
} from "@/components/live/battle/titles/types";

import type {
  VyroWorldCupCountry,
  VyroWorldCupData,
} from "@/components/live/worldcup/types";

interface UseVyroWorldCupInput {
  ranking: BattleRankingEvolutionData;
  titles: VyroTitlesState;

  countryCode?: string;
  countryName?: string;
}

function clampProbability(
  value: number,
): number {
  return Math.min(
    95,
    Math.max(
      5,
      Math.round(value),
    ),
  );
}

export function useVyroWorldCup({
  ranking,
  titles,
  countryCode = "CL",
  countryName = "Chile",
}: UseVyroWorldCupInput) {
  const data =
    useMemo<
      VyroWorldCupData
    >(() => {
      const localCreators =
        [
          ranking.left,
          ranking.right,
        ].filter(
          Boolean,
        );

      const totalWins =
        localCreators.reduce(
          (
            total,
            creator,
          ) =>
            total +
            (creator?.wins ?? 0),
          0,
        );

      const totalBattles =
        localCreators.reduce(
          (
            total,
            creator,
          ) =>
            total +
            (creator
              ? creator.wins +
                creator.losses +
                creator.draws
              : 0),
          0,
        );

      const localScore =
        localCreators.reduce(
          (
            total,
            creator,
          ) =>
            total +
            (creator?.score ?? 0),
          0,
        );

      const localMomentum =
        localCreators.reduce(
          (
            total,
            creator,
          ) =>
            total +
            (creator?.streak ?? 0),
          0,
        );

      const chile:
        VyroWorldCupCountry = {
          countryCode,
          countryName,
          rank:
            1,

          score:
            localScore +
            totalWins * 100,

          totalWins,
          totalBattles,

          kingName:
            titles.king?.creatorName ??
            null,

          topCreators:
            localCreators.map(
              (creator) =>
                creator!.creatorName,
            ),

          momentum:
            localMomentum,
        };

      const argentina:
        VyroWorldCupCountry = {
          countryCode:
            "AR",

          countryName:
            "Argentina",

          rank:
            2,

          score:
            Math.max(
              0,
              Math.round(
                chile.score * 0.88,
              ),
            ),

          totalWins:
            Math.max(
              0,
              totalWins - 1,
            ),

          totalBattles:
            totalBattles,

          kingName:
            null,

          topCreators:
            [],

          momentum:
            Math.max(
              0,
              localMomentum - 1,
            ),
        };

      const countries =
        [
          chile,
          argentina,
        ].sort(
          (a, b) =>
            b.score -
            a.score,
        );

      countries.forEach(
        (
          country,
          index,
        ) => {
          country.rank =
            index + 1;
        },
      );

      const leader =
        countries[0] ??
        null;

      const leftPower =
        Math.max(
          1,
          chile.score +
            chile.momentum * 50,
        );

      const rightPower =
        Math.max(
          1,
          argentina.score +
            argentina.momentum * 50,
        );

      const totalPower =
        leftPower +
        rightPower;

      const leftProbability =
        clampProbability(
          leftPower /
            totalPower *
            100,
        );

      const rightProbability =
        100 -
        leftProbability;

      return {
        countries,

        leader,

        featuredMatchup: {
          id:
            `worldcup:${chile.countryCode}:${argentina.countryCode}:1`,

          left:
            chile,

          right:
            argentina,

          leftProbability,

          rightProbability,

          hypeMessage:
            leftProbability ===
            rightProbability
              ? "Choque totalmente equilibrado: cualquier país puede tomar el liderazgo mundial."
              : leftProbability >
                  rightProbability
                ? `${chile.countryName} llega como favorito, pero ${argentina.countryName} puede cambiar el ranking mundial.`
                : `${argentina.countryName} amenaza seriamente el liderazgo de ${chile.countryName}.`,
        },

        seasonName:
          "VYRO WORLD CUP",

        seasonNumber:
          1,
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

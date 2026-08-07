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
  NextChallengerData,
  NextChallengerPrediction,
} from "@/components/live/battle/challenger/types";

interface UseNextChallengerInput {
  ranking: BattleRankingEvolutionData;
  titles: VyroTitlesState;

  countryCode?: string;

  leftFollowers?: number;
  rightFollowers?: number;
}

function clamp(
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

function getLevelName(
  score: number,
): string {
  if (score >= 1200) {
    return "VYRO INFINITY";
  }

  if (score >= 900) {
    return "VYRO IMMORTAL";
  }

  if (score >= 700) {
    return "VYRO APEX";
  }

  if (score >= 500) {
    return "VYRO TITAN";
  }

  if (score >= 350) {
    return "VYRO PRIME";
  }

  if (score >= 220) {
    return "VYRO NOVA";
  }

  if (score >= 120) {
    return "VYRO PULSE";
  }

  return "VYRO SPARK";
}

function getWinRate(
  creator: BattleRankingCreator,
): number {
  const total =
    creator.wins +
    creator.losses +
    creator.draws;

  if (total === 0) {
    return 0;
  }

  return Math.round(
    creator.wins /
      total *
      100,
  );
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

export function useNextChallenger({
  ranking,
  titles,
  countryCode = "CL",
  leftFollowers = 0,
  rightFollowers = 0,
}: UseNextChallengerInput) {
  const data =
    useMemo<
      NextChallengerData
    >(() => {
      if (
        !ranking.left ||
        !ranking.right
      ) {
        return {
          champion: null,
          challenger: null,
          headline:
            "Buscando el próximo gran enfrentamiento",
          subtitle:
            "VYRO AI está analizando posibles retadores.",
          hypeMessage:
            "La arena espera nuevos competidores.",
          confidence:
            0,
        };
      }

      const leftPower =
        ranking.left.score +
        ranking.left.wins * 35 +
        ranking.left.streak * 20 +
        leftFollowers * 0.01;

      const rightPower =
        ranking.right.score +
        ranking.right.wins * 35 +
        ranking.right.streak * 20 +
        rightFollowers * 0.01;

      const totalPower =
        Math.max(
          1,
          leftPower +
            rightPower,
        );

      const leftProbability =
        clamp(
          leftPower /
            totalPower *
            100,
        );

      const rightProbability =
        100 -
        leftProbability;

      const buildPrediction = (
        creator: BattleRankingCreator,
        followers: number,
        probability: number,
      ): NextChallengerPrediction => ({
        creatorId:
          creator.creatorId,

        creatorName:
          creator.creatorName,

        countryCode,

        level:
          getLevelName(
            creator.score,
          ),

        score:
          creator.score,

        followers,

        battleWins:
          creator.wins,

        winRate:
          getWinRate(
            creator,
          ),

        streak:
          creator.streak,

        victoryProbability:
          probability,

        title:
          getTitle(
            creator.creatorId,
            titles,
          ),
      });

      const leftPrediction =
        buildPrediction(
          ranking.left,
          leftFollowers,
          leftProbability,
        );

      const rightPrediction =
        buildPrediction(
          ranking.right,
          rightFollowers,
          rightProbability,
        );

      const champion =
        titles.king
          ? titles.king.creatorId ===
              leftPrediction.creatorId
            ? leftPrediction
            : titles.king.creatorId ===
                rightPrediction.creatorId
              ? rightPrediction
              : ranking.leader?.creatorId ===
                  leftPrediction.creatorId
                ? leftPrediction
                : rightPrediction
          : ranking.leader?.creatorId ===
              leftPrediction.creatorId
            ? leftPrediction
            : ranking.leader?.creatorId ===
                rightPrediction.creatorId
              ? rightPrediction
              : leftPrediction.score >=
                  rightPrediction.score
                ? leftPrediction
                : rightPrediction;

      const challenger =
        champion.creatorId ===
        leftPrediction.creatorId
          ? rightPrediction
          : leftPrediction;

      const probabilityGap =
        Math.abs(
          champion.victoryProbability -
            challenger.victoryProbability,
        );

      const confidence =
        clamp(
          60 +
            probabilityGap,
        );

      const headline =
        `${champion.creatorName} vs ${challenger.creatorName}`;

      const subtitle =
        champion.title ===
        "VYRO KING"
          ? `${challenger.creatorName} aparece como el próximo retador del VYRO KING.`
          : `${challenger.creatorName} amenaza el liderazgo actual de ${champion.creatorName}.`;

      const hypeMessage =
        challenger.victoryProbability >=
        45
          ? `¡Peligro real! ${challenger.creatorName} tiene opciones serias de destronar a ${champion.creatorName}.`
          : challenger.streak >= 3
            ? `${challenger.creatorName} llega encendido con una racha de ${challenger.streak} victorias.`
            : `La próxima batalla puede cambiar el orden competitivo de VYRO.`;

      return {
        champion,
        challenger,
        headline,
        subtitle,
        hypeMessage,
        confidence,
      };
    }, [
      countryCode,
      leftFollowers,
      ranking,
      rightFollowers,
      titles,
    ]);

  return {
    data,
  };
}

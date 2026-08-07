"use client";

import {
  useMemo,
} from "react";

import type {
  BattleAnalyticsSnapshot,
} from "@/components/live/battle/analytics/types";

import type {
  BattleDirectorState,
} from "@/components/live/battle/director/types";

import type {
  BattleRankingCreator,
  BattleRankingEvolutionData,
} from "@/components/live/battle/ranking/types";

interface UseBattleRankingEvolutionInput {
  analytics: BattleAnalyticsSnapshot;
  director: BattleDirectorState;

  leftCreatorId: string | null;
  leftCreatorName: string | null;

  rightCreatorId: string | null;
  rightCreatorName: string | null;
}

function clamp(
  value: number,
  min: number,
  max: number,
): number {
  return Math.min(
    max,
    Math.max(
      min,
      Math.round(value),
    ),
  );
}

export function useBattleRankingEvolution({
  analytics,
  director,
  leftCreatorId,
  leftCreatorName,
  rightCreatorId,
  rightCreatorName,
}: UseBattleRankingEvolutionInput) {
  const data =
    useMemo<
      BattleRankingEvolutionData
    >(() => {
      if (
        !leftCreatorId ||
        !leftCreatorName ||
        !rightCreatorId ||
        !rightCreatorName
      ) {
        return {
          left: null,
          right: null,
          leader: null,
          intensityBonus: 0,
          battleWeight: 0,
        };
      }

      const intensityBonus =
        clamp(
          director.intensity /
            10,
          0,
          10,
        );

      const battleWeight =
        clamp(
          analytics.completedRounds * 5 +
            intensityBonus,
          1,
          100,
        );

      const leftWins =
        analytics.leftWins;

      const rightWins =
        analytics.rightWins;

      const draws =
        analytics.draws;

      const leftLosses =
        rightWins;

      const rightLosses =
        leftWins;

      const leftBaseScore =
        leftWins * 100 -
        leftLosses * 25 +
        draws * 20 +
        battleWeight;

      const rightBaseScore =
        rightWins * 100 -
        rightLosses * 25 +
        draws * 20 +
        battleWeight;

      const leftScore =
        Math.max(
          0,
          leftBaseScore,
        );

      const rightScore =
        Math.max(
          0,
          rightBaseScore,
        );

      const leftRank =
        leftScore >= rightScore
          ? 1
          : 2;

      const rightRank =
        rightScore > leftScore
          ? 1
          : 2;

      const leftPreviousRank =
        analytics.completedRounds <= 1
          ? leftRank
          : leftWins >= rightWins
            ? 2
            : 1;

      const rightPreviousRank =
        analytics.completedRounds <= 1
          ? rightRank
          : rightWins > leftWins
            ? 2
            : 1;

      const leftMovement =
        leftPreviousRank -
        leftRank;

      const rightMovement =
        rightPreviousRank -
        rightRank;

      const leftStatus:
        BattleRankingCreator["status"] =
          leftMovement > 0
            ? "rising"
            : leftMovement < 0
              ? "falling"
              : "stable";

      const rightStatus:
        BattleRankingCreator["status"] =
          rightMovement > 0
            ? "rising"
            : rightMovement < 0
              ? "falling"
              : "stable";

      const leftStreak =
        leftWins > rightWins
          ? leftWins -
            rightWins
          : 0;

      const rightStreak =
        rightWins > leftWins
          ? rightWins -
            leftWins
          : 0;

      const left:
        BattleRankingCreator = {
          creatorId:
            leftCreatorId,

          creatorName:
            leftCreatorName,

          rank:
            leftRank,

          previousRank:
            leftPreviousRank,

          score:
            leftScore,

          wins:
            leftWins,

          losses:
            leftLosses,

          draws,

          streak:
            leftStreak,

          movement:
            leftMovement,

          status:
            leftStatus,
        };

      const right:
        BattleRankingCreator = {
          creatorId:
            rightCreatorId,

          creatorName:
            rightCreatorName,

          rank:
            rightRank,

          previousRank:
            rightPreviousRank,

          score:
            rightScore,

          wins:
            rightWins,

          losses:
            rightLosses,

          draws,

          streak:
            rightStreak,

          movement:
            rightMovement,

          status:
            rightStatus,
        };

      const leader =
        left.score >
        right.score
          ? left
          : right.score >
              left.score
            ? right
            : null;

      return {
        left,
        right,
        leader,
        intensityBonus,
        battleWeight,
      };
    }, [
      analytics,
      director,
      leftCreatorId,
      leftCreatorName,
      rightCreatorId,
      rightCreatorName,
    ]);

  return {
    data,
  };
}

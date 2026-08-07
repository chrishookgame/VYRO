"use client";

import {
  useMemo,
} from "react";

import type {
  BattleAnalyticsSnapshot,
} from "@/components/live/battle/analytics/types";

import type {
  BattleHighlight,
} from "@/components/live/battle/highlights/types";

import type {
  BattleMVPResult,
  BattleMVPScore,
} from "@/components/live/battle/mvp/types";

interface UseBattleMVPInput {
  analytics: BattleAnalyticsSnapshot;
  highlights: BattleHighlight[];

  leftCreatorId: string | null;
  leftCreatorName: string | null;

  rightCreatorId: string | null;
  rightCreatorName: string | null;
}

function clamp(
  value: number,
): number {
  return Math.min(
    100,
    Math.max(
      0,
      Math.round(value),
    ),
  );
}

export function useBattleMVP({
  analytics,
  highlights,
  leftCreatorId,
  leftCreatorName,
  rightCreatorId,
  rightCreatorName,
}: UseBattleMVPInput) {
  const result =
    useMemo<
      BattleMVPResult
    >(() => {
      if (
        !leftCreatorId ||
        !leftCreatorName ||
        !rightCreatorId ||
        !rightCreatorName
      ) {
        return {
          winner: null,
          left: null,
          right: null,
          confidence: 0,
          reason:
            "Esperando datos suficientes para calcular el MVP.",
        };
      }

      const victoryHighlights =
        highlights.filter(
          (highlight) =>
            highlight.type ===
            "victory",
        ).length;

      const championHighlights =
        highlights.filter(
          (highlight) =>
            highlight.type ===
            "champion",
        ).length;

      const totalWins =
        analytics.leftWins +
        analytics.rightWins;

      const leftWinShare =
        totalWins > 0
          ? analytics.leftWins /
            totalWins
          : 0;

      const rightWinShare =
        totalWins > 0
          ? analytics.rightWins /
            totalWins
          : 0;

      const leftWinsScore =
        Math.round(
          leftWinShare *
            50,
        );

      const rightWinsScore =
        Math.round(
          rightWinShare *
            50,
        );

      const sharedHighlightBase =
        Math.min(
          20,
          victoryHighlights * 3 +
            championHighlights * 5,
        );

      const leftMomentum =
        analytics.leftWins >
        analytics.rightWins
          ? 15
          : analytics.leftWins ===
              analytics.rightWins
            ? 8
            : 4;

      const rightMomentum =
        analytics.rightWins >
        analytics.leftWins
          ? 15
          : analytics.leftWins ===
              analytics.rightWins
            ? 8
            : 4;

      const scoreDifference =
        Math.abs(
          analytics.leftWins -
            analytics.rightWins,
        );

      const dominanceBonus =
        Math.min(
          15,
          scoreDifference * 5,
        );

      const leftDominance =
        analytics.leftWins >
        analytics.rightWins
          ? dominanceBonus
          : 0;

      const rightDominance =
        analytics.rightWins >
        analytics.leftWins
          ? dominanceBonus
          : 0;

      const leftScore:
        BattleMVPScore = {
          creatorId:
            leftCreatorId,

          creatorName:
            leftCreatorName,

          winsScore:
            leftWinsScore,

          highlightScore:
            sharedHighlightBase,

          momentumScore:
            leftMomentum,

          dominanceScore:
            leftDominance,

          score:
            clamp(
              leftWinsScore +
                sharedHighlightBase +
                leftMomentum +
                leftDominance,
            ),
        };

      const rightScore:
        BattleMVPScore = {
          creatorId:
            rightCreatorId,

          creatorName:
            rightCreatorName,

          winsScore:
            rightWinsScore,

          highlightScore:
            sharedHighlightBase,

          momentumScore:
            rightMomentum,

          dominanceScore:
            rightDominance,

          score:
            clamp(
              rightWinsScore +
                sharedHighlightBase +
                rightMomentum +
                rightDominance,
            ),
        };

      const winner =
        leftScore.score >
        rightScore.score
          ? leftScore
          : rightScore.score >
              leftScore.score
            ? rightScore
            : null;

      const scoreGap =
        Math.abs(
          leftScore.score -
            rightScore.score,
        );

      const confidence =
        winner
          ? clamp(
              60 +
                scoreGap * 2,
            )
          : 50;

      const reason =
        winner
          ? `${winner.creatorName} lidera el MVP Score combinando victorias, momentum y dominio de la serie.`
          : "Los dos creadores mantienen un rendimiento muy equilibrado.";

      return {
        winner,
        left:
          leftScore,
        right:
          rightScore,
        confidence,
        reason,
      };
    }, [
      analytics,
      highlights,
      leftCreatorId,
      leftCreatorName,
      rightCreatorId,
      rightCreatorName,
    ]);

  return {
    result,
  };
}

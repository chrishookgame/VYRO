"use client";

import {
  useMemo,
} from "react";

import type {
  BattleRankingEvolutionData,
} from "@/components/live/battle/ranking/types";

import {
  getVyroLiveLevelName,
} from "@/components/live/achievements/levels/AchievementLevels";

import type {
  VyroTitlesState,
} from "@/components/live/battle/titles/types";

import type {
  VyroLiveCelebrationEvent,
  VyroLiveCelebrationState,
} from "@/components/live/celebrations/types";

interface UseVyroLiveCelebrationsInput {
  ranking: BattleRankingEvolutionData;
  titles: VyroTitlesState;
}

function getIntensity(
  streak: number,
): VyroLiveCelebrationEvent["intensity"] {
  if (streak >= 10) {
    return "legendary";
  }

  if (streak >= 5) {
    return "epic";
  }

  return "standard";
}



export function useVyroLiveCelebrations({
  ranking,
  titles,
}: UseVyroLiveCelebrationsInput) {
  const state =
    useMemo<
      VyroLiveCelebrationState
    >(() => {
      const events:
        VyroLiveCelebrationEvent[] = [];

      const creators =
        [
          ranking.left,
          ranking.right,
        ].filter(
          Boolean,
        );

      creators.forEach(
        (creator) => {
          if (!creator) {
            return;
          }

          if (
            creator.streak >= 3
          ) {
            events.push({
              id:
                `streak:${creator.creatorId}:${creator.streak}`,

              type:
                "WIN_STREAK",

              intensity:
                getIntensity(
                  creator.streak,
                ),

              creatorId:
                creator.creatorId,

              creatorName:
                creator.creatorName,

              title:
                `${creator.creatorName} está en racha`,

              message:
                `${creator.creatorName} alcanza ${creator.streak} victorias consecutivas.`,

              levelName:
                null,

              streak:
                creator.streak,

              visible:
                true,
            });
          }

          const levelName =
            getVyroLiveLevelName(
              creator.score,
            );

          if (
            creator.score >= 120
          ) {
            events.push({
              id:
                `level:${creator.creatorId}:${levelName}`,

              type:
                "LEVEL_UP",

              intensity:
                creator.score >= 900
                  ? "legendary"
                  : creator.score >= 500
                    ? "epic"
                    : "standard",

              creatorId:
                creator.creatorId,

              creatorName:
                creator.creatorName,

              title:
                `${creator.creatorName} alcanzó ${levelName}`,

              message:
                `VYRO felicita a ${creator.creatorName} por alcanzar el nivel ${levelName}.`,

              levelName,

              streak:
                null,

              visible:
                true,
            });
          }
        },
      );

      if (titles.king) {
        events.unshift({
          id:
            `title:${titles.king.creatorId}:king`,

          type:
            "TITLE_GAINED",

          intensity:
            "legendary",

          creatorId:
            titles.king.creatorId,

          creatorName:
            titles.king.creatorName,

          title:
            `¡${titles.king.creatorName} es VYRO KING!`,

          message:
            `${titles.king.creatorName} ocupa el puesto #1 de ${titles.king.countryName}.`,

          levelName:
            null,

          streak:
            null,

          visible:
            true,
        });
      }

      return {
        active:
          events[0] ??
          null,

        queue:
          events.slice(
            1,
          ),
      };
    }, [
      ranking,
      titles,
    ]);

  return {
    state,
  };
}

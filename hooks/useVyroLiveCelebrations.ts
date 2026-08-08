"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  BattleRankingEvolutionData,
} from "@/components/live/battle/ranking/types";

import {
  getVyroLiveLevel,
  VYRO_LIVE_LEVELS,
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



function getVyroLiveLevelIndex(
  levelName: string,
): number {
  return VYRO_LIVE_LEVELS.findIndex(
    (level) =>
      level.name === levelName,
  );
}


export function useVyroLiveCelebrations({
  ranking,
  titles,
}: UseVyroLiveCelebrationsInput) {
  const previousLevelsRef =
    useRef<Map<string, string>>(
      new Map(),
    );

  const [
    levelTransitionEvents,
    setLevelTransitionEvents,
  ] =
    useState<
      VyroLiveCelebrationEvent[]
    >([]);

  useEffect(() => {
    const creators =
      [
        ranking.left,
        ranking.right,
      ].filter(
        Boolean,
      );

    const transitionEvents:
      VyroLiveCelebrationEvent[] = [];

    const activeCreatorIds =
      new Set<string>();

    creators.forEach(
      (creator) => {
        if (!creator) {
          return;
        }

        activeCreatorIds.add(
          creator.creatorId,
        );

        const level =
          getVyroLiveLevel(
            creator.score,
          );

        const previousLevelName =
          previousLevelsRef.current.get(
            creator.creatorId,
          );

        previousLevelsRef.current.set(
          creator.creatorId,
          level.name,
        );

        // First observation establishes baseline only.
        if (!previousLevelName) {
          return;
        }

        const previousLevelIndex =
          getVyroLiveLevelIndex(
            previousLevelName,
          );

        const currentLevelIndex =
          getVyroLiveLevelIndex(
            level.name,
          );

        const leveledUp =
          previousLevelIndex >= 0 &&
          currentLevelIndex >
            previousLevelIndex;

        if (
          !leveledUp ||
          !level.celebrates
        ) {
          return;
        }

        transitionEvents.push({
          id:
            `level:${creator.creatorId}:${previousLevelName}:${level.name}`,

          type:
            "LEVEL_UP",

          intensity:
            level.intensity,

          creatorId:
            creator.creatorId,

          creatorName:
            creator.creatorName,

          title:
            `${creator.creatorName} alcanzó ${level.name}`,

          message:
            `VYRO felicita a ${creator.creatorName} por alcanzar el nivel ${level.name}.`,

          levelName:
            level.name,

          streak:
            null,

          visible:
            true,
        });
      },
    );

    for (
      const creatorId of
      previousLevelsRef.current.keys()
    ) {
      if (
        !activeCreatorIds.has(
          creatorId,
        )
      ) {
        previousLevelsRef.current.delete(
          creatorId,
        );
      }
    }

    setLevelTransitionEvents(
      transitionEvents,
    );
  }, [
    ranking,
  ]);

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

        },
      );

      events.push(
        ...levelTransitionEvents,
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
      levelTransitionEvents,
      ranking,
      titles,
    ]);

  return {
    state,
  };
}

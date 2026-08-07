"use client";

import {
  useMemo,
} from "react";

import type {
  NextChallengerData,
} from "@/components/live/battle/challenger/types";

import type {
  VyroWorldCupData,
} from "@/components/live/worldcup/types";

import type {
  WorldTitleDefenseEvent,
  WorldVyroKingState,
} from "@/components/live/worldtitles/types";

interface UseWorldVyroKingInput {
  worldCup: VyroWorldCupData;
  nextChallenger: NextChallengerData;
}

export function useWorldVyroKing({
  worldCup,
  nextChallenger,
}: UseWorldVyroKingInput) {
  const state =
    useMemo<
      WorldVyroKingState
    >(() => {
      const champion =
        nextChallenger.champion;

      const challenger =
        nextChallenger.challenger;

      if (
        !champion ||
        !challenger
      ) {
        return {
          holder: null,
          latestDefense: null,
          totalDefenses: 0,
          challengerName: null,
          dangerLevel: "safe",
        };
      }

      const worldLeader =
        worldCup.leader;

      const holderScore =
        champion.score +
        champion.battleWins * 100 +
        champion.streak * 50;

      const challengerScore =
        challenger.score +
        challenger.battleWins * 100 +
        challenger.streak * 50;

      const successful =
        holderScore >=
        challengerScore;

      const defenseNumber =
        Math.max(
          1,
          champion.battleWins,
        );

      const latestDefense:
        WorldTitleDefenseEvent = {
          id:
            `world-defense:${champion.creatorId}:${challenger.creatorId}:${defenseNumber}`,

          holderId:
            champion.creatorId,

          holderName:
            champion.creatorName,

          challengerId:
            challenger.creatorId,

          challengerName:
            challenger.creatorName,

          holderScore,

          challengerScore,

          successful,

          defenseNumber,
        };

      const difference =
        holderScore -
        challengerScore;

      const dangerLevel:
        WorldVyroKingState["dangerLevel"] =
          difference >= 500
            ? "safe"
            : difference >= 250
              ? "watch"
              : difference >= 75
                ? "danger"
                : "critical";

      const holder =
        successful
          ? {
              creatorId:
                champion.creatorId,

              creatorName:
                champion.creatorName,

              countryCode:
                champion.countryCode,

              countryName:
                worldLeader?.countryName ??
                champion.countryCode,

              worldRank:
                1,

              score:
                holderScore,

              totalWins:
                champion.battleWins,

              totalBattles:
                Math.max(
                  champion.battleWins,
                  1,
                ),

              bestStreak:
                champion.streak,

              titleDefenses:
                defenseNumber,

              active:
                true,

              acquiredAt:
                null,

              previousHolderName:
                null,
            }
          : {
              creatorId:
                challenger.creatorId,

              creatorName:
                challenger.creatorName,

              countryCode:
                challenger.countryCode,

              countryName:
                challenger.countryCode,

              worldRank:
                1,

              score:
                challengerScore,

              totalWins:
                challenger.battleWins,

              totalBattles:
                Math.max(
                  challenger.battleWins,
                  1,
                ),

              bestStreak:
                challenger.streak,

              titleDefenses:
                0,

              active:
                true,

              acquiredAt:
                null,

              previousHolderName:
                champion.creatorName,
            };

      return {
        holder,

        latestDefense,

        totalDefenses:
          successful
            ? defenseNumber
            : 0,

        challengerName:
          successful
            ? challenger.creatorName
            : champion.creatorName,

        dangerLevel:
          successful
            ? dangerLevel
            : "critical",
      };
    }, [
      nextChallenger,
      worldCup,
    ]);

  const history =
    useMemo<
      WorldTitleDefenseEvent[]
    >(() => {
      return state.latestDefense
        ? [state.latestDefense]
        : [];
    }, [
      state.latestDefense,
    ]);

  return {
    state,
    history,
  };
}
